def createCode(number, formula):
    left_paren = "("
    right_paren = ")"
    code = left_paren * number + formula + right_paren * number
    return code


with open("test.py", "w") as f:
    f.write("print" + createCode(92, "1+1"))

with open("test.rb", "w") as f:
    f.write("puts" + createCode(9993, "1+1"))

with open("test.js", "w") as f:
    f.write("console.log" + createCode(1734, "1+1"))
