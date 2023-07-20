import whisper

model = whisper.load_model("large")

result = model.transcribe("zenn.mp3", language="ja")

with open("result.txt", "w") as f:
    f.write(result["text"])
