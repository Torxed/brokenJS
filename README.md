# brokenJS
A few fixes to the things that are broken in JavaScript.<br>
But also a few object interaction improvements in a generic way,<br>
sort of a minimalistic approach to a framework to interact with HTML resources.

# "Installation"

    <script src="./brokenJS/broken.js"></script>

# Example usage

	<html>
		<head>
			<style>
				#chatHistory {
					border: 1px solid #FF0000;
				}

				#message {
					border: 1px solid #2256A2;
				}
			</style>

			<!-- Import: -->
			<script src="./brokenJS/broken.js"></script>
			<script>
				class chatHistory extends div {
					constructor(x=0, y=0, width=AUTO, height=AUTO) {
						super('chatHistory', x, y, width, height);
						this.create();
					}
				}

				class message extends div {
					constructor(message=null, x=0, y=0) {
						super('message', x, y);
						if(message)
							this.content = message;
						this.create();
					}
				}

				window.onload = function(e) {
					var history = new chatHistory(100, 100, 300, 50);
					// appending to `body` requires the use of a dict
					// because brokenJS (currently) looks for a `.obj` reference.
					history.append_to({obj: document.body});

					var test_message = new message('This is a message');
					test_message.append_to(history);

					// Adding content manually requires a .update() call.
					var test_message2 = new message();
					test_message2.content = 'Second message';
					test_message2.update();
					test_message2.append_to(history);
				}
			</script>
		</head>

		<body>
			<div id="normalDiv">
				Some static content.
			</div>
		</body>
	</html>

## Pass by reference

Instead of passing a value to a function/class,<br>
this just gives a easier handle to modify a originating variable by<br>
using the variable name and a context to modify the original variable -<br>
rather than modifying the passed value.

	var test = 0;

	function addOne(variable) {
		variable += 1;
	}
	addOne(test);
	console.log(test);

The following will result in 0, because JS is [pass by value](https://i.stack.imgur.com/QdcG2.gif).<br>
Instead, what we could do use find the reference to the variable and modify it.

	var test = 0;

	function addOne(variable) {
		var varName = varReference(variable);
		this[varName] += 1;
	}

	window.onload = function() {
		addOne.call(window, {test});
		
		console.log(test);
	}
The only down-side to this, is that you still need to pass the variable in a<br>
`dictionary` *(Object)* manner, otherwise the nasty hack won't work.

And you need to use the `.call(<context>, {var})` method, because<br>
you need to know which context to modify (by passing the var name) later.

Working on a easier way to achieve the same result, but it's tricky.