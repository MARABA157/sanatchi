from huggingface_hub import hf_hub_download
import os

def download_model(repo_id, filename, output_dir):
    print(f"İndiriliyor: {filename} from {repo_id}")
    try:
        file_path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            local_dir=output_dir,
            local_dir_use_symlinks=False
        )
        print(f"Başarıyla indirildi: {file_path}")
        return file_path
    except Exception as e:
        print(f"Hata oluştu: {str(e)}")
        return None

# Çıktı dizinini oluştur
output_dir = "localai-data"
os.makedirs(output_dir, exist_ok=True)

# Zeroscope modelini indir
zeroscope_files = [
    ("cerspense/zeroscope_v2_576w", "model_index.json"),
    ("cerspense/zeroscope_v2_576w", "scheduler_config.json"),
    ("cerspense/zeroscope_v2_576w", "tokenizer_config.json"),
    ("cerspense/zeroscope_v2_576w", "unet/diffusion_pytorch_model.bin"),
    ("cerspense/zeroscope_v2_576w", "vae/diffusion_pytorch_model.bin")
]

print("\nZeroscope modeli indiriliyor...")
for repo_id, filename in zeroscope_files:
    download_model(repo_id, filename, os.path.join(output_dir, "zeroscope_v2_576w"))

# ModelScope modelini indir
modelscope_files = [
    ("damo-vilab/text-to-video-ms-1.7b", "model_index.json"),
    ("damo-vilab/text-to-video-ms-1.7b", "scheduler_config.json"),
    ("damo-vilab/text-to-video-ms-1.7b", "tokenizer_config.json"),
    ("damo-vilab/text-to-video-ms-1.7b", "unet/diffusion_pytorch_model.bin"),
    ("damo-vilab/text-to-video-ms-1.7b", "vae/diffusion_pytorch_model.bin")
]

print("\nModelScope modeli indiriliyor...")
for repo_id, filename in modelscope_files:
    download_model(repo_id, filename, os.path.join(output_dir, "text-to-video-ms"))
