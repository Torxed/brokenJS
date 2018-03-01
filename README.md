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