import socket
from picarx import Picarx
from time import sleep

HOST = "192.168.50.181" # IP address of your Raspberry PI
PORT = 65432          # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()          # interrupts for available data enabled
    is_moving = True
    # I AM PICAR. THIS IS MY CODE.
    px = Picarx()

    try:
        while 1:
            client, clientInfo = s.accept()
            print("server recv from: ", clientInfo)

            #########
            # Getting message from frontend/client into our car!
            ##########
            # information placed in holding buffer of size 1024 bytes (0x400)
            message_from_client = client.recv(1024)      # receive 1024 Bytes of message in binary format
            if message_from_client != b"":
                print(message_from_client)  
                if message_from_client == b"forward": 
                    px.set_dir_servo_angle(0)
                    px.forward(80)  
                    is_moving = True
                if message_from_client == b"left": 
                    px.set_dir_servo_angle(-30)
                    px.forward(80)
                    is_moving = True
                if message_from_client == b"right": 
                    px.set_dir_servo_angle(30)
                    px.forward(80) 
                    is_moving = True
                if message_from_client == b"backward": 
                    px.set_dir_servo_angle(0)
                    px.backward(80)
                    is_moving = True
                if message_from_client == b"stop":
                    px.stop() 
                    is_moving = False
                
            if is_moving:
                sleep(0.2)
            
            #########
            # Okay, message from client is processed. Now, sending data back to client.
            #########
            is_moving_data = ("is_moving: " + str(is_moving)).encode('utf-8') # turn it into a string, and then into bytes, because we're sending messages (not data!)
            print(f"I {'am' if is_moving else 'am not'} moving")
            ultrasonic_data = ("ultrasonic: " + str(px.get_distance())).encode('utf-8')    # giving message from picar to client/frontend
            print(f"My distance is {ultrasonic_data}")
            client.sendall(is_moving_data) #.encode('utf-8') #
            client.sendall(ultrasonic_data) # Echo back to client


    except Exception as e: 
        px.stop()
        print(f"Closing socket because of exception: {str(e)}")
        client.close()
        s.close()
