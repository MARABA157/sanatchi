import torch
from transformers import VitsModel, AutoTokenizer
import scipy.io.wavfile
import sys
import json
import os
import tempfile
import traceback

try:
    # Model ve tokenizer'ı yükle
    model = VitsModel.from_pretrained("facebook/mms-tts-eng")
    tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-eng")

    # Metin kontrolü
    if len(sys.argv) <= 1:
        raise ValueError("No text provided")
    
    text = sys.argv[1]
    print(f"Generating speech for text: {text}")

    # Ses oluştur
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        output = model(**inputs).waveform

    # Geçici dosya oluştur
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, f"speech_{os.getpid()}.wav")

    # Ses dosyasını kaydet
    scipy.io.wavfile.write(output_path, rate=model.config.sampling_rate, data=output[0].numpy())

    print(json.dumps({"success": True, "path": output_path}))

except Exception as e:
    error_msg = str(e)
    stack_trace = traceback.format_exc()
    print(json.dumps({
        "success": False,
        "error": error_msg,
        "stack_trace": stack_trace
    }), file=sys.stderr)
