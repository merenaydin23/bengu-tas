"""
BengüNet — Eğitim ve ONNX Dışa Aktarma Scripti
Görüntü İşleme & Derin Öğrenme Eğitimi
"""

import os
import json
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split

from model import BenguNet, CLASSES, NUM_CLASSES
from dataset_generator import TurkishHandwrittenDataset

def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Eğitim Cihazı: {device}")
    
    # 1. Veri Seti (Her sınıf için 300 örnek -> Toplam ~11.700 örnek)
    full_dataset = TurkishHandwrittenDataset(samples_per_class=300)
    train_size = int(0.85 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False)
    
    # 2. Model, Loss, Optimizer
    model = BenguNet(num_classes=NUM_CLASSES).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=8)
    
    epochs = 8
    best_val_acc = 0.0
    start_time = time.time()
    
    print("\n--- Model Eğitimi Başlıyor (BengüNet CNN) ---")
    for epoch in range(1, epochs + 1):
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0
        
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs, 1)
            total_train += labels.size(0)
            correct_train += (predicted == labels).sum().item()
            
        scheduler.step()
        train_loss = running_loss / total_train
        train_acc = (correct_train / total_train) * 100
        
        # Doğrulama (Validation)
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0
        
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * images.size(0)
                _, predicted = torch.max(outputs, 1)
                total_val += labels.size(0)
                correct_val += (predicted == labels).sum().item()
                
        val_loss = val_loss / total_val
        val_acc = (correct_val / total_val) * 100
        
        print(f"Epoch [{epoch}/{epochs}] | "
              f"Train Loss: {train_loss:.4f} - Train Acc: %{train_acc:.2f} | "
              f"Val Loss: {val_loss:.4f} - Val Acc: %{val_acc:.2f}")
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), "train/bengu_net.pt")
            
    total_duration = time.time() - start_time
    print(f"\nEğitim Tamamlandı! Süre: {total_duration:.1f} sn | En İyi Val Başarımı: %{best_val_acc:.2f}")
    
    # 3. ONNX Formatına Dışa Aktarma (Web Entegrasyonu)
    os.makedirs("public/model", exist_ok=True)
    onnx_path = "public/model/bengu_net.onnx"
    classes_path = "public/model/classes.json"
    
    model.load_state_dict(torch.load("train/bengu_net.pt"))
    model.eval()
    
    dummy_input = torch.randn(1, 1, 32, 32, device=device)
    print(f"\nONNX Modeli Dışa Aktarılıyor: {onnx_path}")
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
    
    # Sınıf listesini kaydet
    with open(classes_path, "w", encoding="utf-8") as f:
        json.dump(CLASSES, f, ensure_ascii=False, indent=2)
        
    print(f"ONNX modeli ve sınıf tanımları public/model/ içine kaydedildi.")

if __name__ == "__main__":
    train()
