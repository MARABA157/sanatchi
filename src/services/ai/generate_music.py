import torch
from transformers import AutoProcessor, MusicgenForConditionalGeneration
import scipy.io.wavfile
import sys
import json
import os
import tempfile
import traceback

try:
    # Model ve işlemciyi yükle
    processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
    model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

    # Prompt kontrolü
    if len(sys.argv) <= 1:
        raise ValueError("No prompt provided")
    
    prompt = sys.argv[1]
    print(f"Generating music for prompt: {prompt}")

    # Müzik oluştur
    inputs = processor(
        text=[prompt],
        padding=True,
        return_tensors="pt",
    )

    audio = model.generate(**inputs, max_new_tokens=512)

    # Geçici dosya oluştur
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, f"music_{os.getpid()}.wav")

    # Ses dosyasını kaydet
    sampling_rate = model.config.audio_encoder.sampling_rate
    scipy.io.wavfile.write(output_path, rate=sampling_rate, data=audio[0, 0].numpy())

    print(json.dumps({"success": True, "path": output_path}))

except Exception as e:
    error_msg = str(e)
    stack_trace = traceback.format_exc()
    print(json.dumps({
        "success": False,
        "error": error_msg,
        "stack_trace": stack_trace
    }), file=sys.stderr)
