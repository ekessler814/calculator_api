
"""
function runs python eval on input, returns erroneous input if eval crashes
input param is a string in the form (4 + 2) * 8 or 1 + 2 - 10 / 50 (a mathematical expression)
"""
def calculate(input):
    try:
        eval_input = eval(input)
    except (ValueError, SyntaxError) as e:
        # set input variable as "erroneous input" if eval crashes
        eval_input = "erroneous input"
    return eval_input
