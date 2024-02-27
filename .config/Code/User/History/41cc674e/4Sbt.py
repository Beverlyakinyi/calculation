print("selection a function to perform:")
print(" 1. ADD")
print(" 2. SUBTRACT ")
print(" 3. MULTIPLY")
print(" 4. DIVIDE")
operation = input()
if operation == "1":
    num1 = input("first number:")
    num2 = input("second number:")
    print("The sum is " +str(int (num1)+ int(num2)))
elif operation == "2":
    num1 = input("first number:")
    num2 = input("second number:")
    print("The difference is " +str(int(num1)- int(num2)))
elif operation == "3":
    num1 = input("first number:")
    num2 = input("second number:")
    print("The product is " + str(int(num1) * int(num2)))
elif operation == "4":
    num1 = input("first number:")
    num2 = input("second number:")
    print("The  result is " +str(int(num1) / int(num2)))
# print ("the result is " + str(int(num1)/ (num2)))