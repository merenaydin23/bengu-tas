import os
import sys
import json
import torch

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
from model import BenguNet, CLASSES, NUM_CLASSES

def export_onnx():
    os.makedirs("public/model", exist_ok=True)
    onnx_path = "public/model/bengu_net.onnx"
    classes_path = "public/model/classes.json"
    weights_path = "train/bengu_net.pt"
    
    if not os.path.exists(weights_path):
        print(f"Hata: {weights_path} bulunamadı!")
        return

    model = BenguNet(num_classes=NUM_CLASSES)
    model.load_state_dict(torch.load(weights_path, map_location="cpu"))
    model.eval()

    dummy_input = torch.randn(1, 1, 32, 32)
    print(f"Model yükleme tamamlandı. ONNX'e aktarılıyor: {onnx_path}")

    # PyTorch ONNX export (TorchScript / Legacy engine)
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )

    with open(classes_path, "w", encoding="utf-8") as f:
        json.dump(CLASSES, f, ensure_ascii=False, indent=2)

    print(f"Tebrikler! ONNX modeli ve sınıflar hazır: {onnx_path}")

if __name__ == "__main__":
    export_onnx()
