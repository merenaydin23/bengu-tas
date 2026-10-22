import os
import sys
import json
import torch

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
from model import BenguNet, CLASSES, NUM_CLASSES

def export_onnx():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    model_dir = os.path.join(project_root, "public", "model")
    os.makedirs(model_dir, exist_ok=True)
    onnx_path = os.path.join(model_dir, "bengu_net.onnx")
    classes_path = os.path.join(model_dir, "classes.json")
    weights_path = os.path.join(script_dir, "bengu_net.pt")
    
    if not os.path.exists(weights_path):
        print(f"Hata: {weights_path} bulunamadı!")
        return

    model = BenguNet(num_classes=NUM_CLASSES)
    model.load_state_dict(torch.load(weights_path, map_location="cpu"))
    model.eval()

    dummy_input = torch.randn(1, 1, 32, 32)
    print(f"Model yükleme tamamlandı. ONNX'e aktarılıyor: {onnx_path}")

    # PyTorch ONNX export (Self-contained single file)
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        export_params=True,
        opset_version=17,
        input_names=['input'],
        output_names=['output'],
        dynamo=False
    )

    with open(classes_path, "w", encoding="utf-8") as f:
        json.dump(CLASSES, f, ensure_ascii=False, indent=2)

    print(f"Tebrikler! Tek dosya ONNX modeli ve sınıflar hazır: {onnx_path}")

if __name__ == "__main__":
    export_onnx()
