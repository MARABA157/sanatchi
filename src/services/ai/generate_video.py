from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
import torch
import sys
import json
import os
import tempfile
import traceback

try:
    # CPU kullan
    device = "cpu"
    print(f"Using device: {device}")

    # Model yükle
    pipe = DiffusionPipeline.from_pretrained(
        "damo-vilab/text-to-video-ms-1.7b",
        torch_dtype=torch.float32
    )
    pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config)
    pipe = pipe.to(device)

    # Prompt kontrolü
    if len(sys.argv) <= 1:
        raise ValueError("No prompt provided")
    
    prompt = sys.argv[1]
    print(f"Generating video for prompt: {prompt}")

    # Video oluştur
    video_frames = pipe(
        prompt,
        num_inference_steps=25,
        num_frames=16,
        height=256,
        width=256
    ).frames

    print(f"Generated {len(video_frames)} frames")

    # Geçici dosya oluştur
    temp_dir = tempfile.gettempdir()
    output_path = os.path.join(temp_dir, f"video_{os.getpid()}.mp4")

    # Video dosyası olarak kaydet
    import imageio
    imageio.mimsave(output_path, video_frames, fps=8)

    print(json.dumps({"success": True, "path": output_path}))

except Exception as e:
    error_msg = str(e)
    stack_trace = traceback.format_exc()
    print(json.dumps({
        "success": False,
        "error": error_msg,
        "stack_trace": stack_trace
    }), file=sys.stderr)
