"""
Training script for Giri Raksha Landslide Susceptibility Random Forest Classifier
Grounded in Geological Survey of India (GSI) and IMD regional thresholds.
Trains a Scikit-Learn RandomForestClassifier on geotechnical and hydrometeorological features
for the 8 North Eastern Region (NER) states.
"""

import sys
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split

FEATURE_NAMES = [
    "rainfall24h",
    "rainfall72h",
    "soilMoisture",
    "slope",
    "elevation",
    "historicalRisk",
    "roadDistance",
    "ndvi",
]

def generate_synthetic_ner_dataset(n_samples: int = 3000):
    """
    Generate realistic geotechnical and meteorological training data
    calibrated against NER (Meghalaya, Assam, Sikkim, etc.) rainfall and slope conditions.
    """
    np.random.seed(42)

    # 1. Rainfall 24h (0 - 350 mm, monsoon exponential distribution)
    rainfall24h = np.clip(np.random.exponential(scale=65, size=n_samples), 0, 350)

    # 2. Rainfall 72h (cumulative antecedent rainfall)
    rainfall72h = np.clip(
        rainfall24h * np.random.uniform(1.3, 2.2, size=n_samples) + np.random.normal(0, 15, size=n_samples),
        0,
        600,
    )

    # 3. Soil Moisture saturation % (15% - 98%)
    soil_moisture = np.clip(
        30 + rainfall24h * 0.22 + rainfall72h * 0.05 + np.random.normal(0, 8, size=n_samples),
        15,
        98,
    )

    # 4. Slope gradient in degrees (12° - 65°)
    slope = np.random.uniform(12, 65, size=n_samples)

    # 5. Elevation in meters (200m - 3500m across NER terrain)
    elevation = np.random.uniform(200, 3500, size=n_samples)

    # 6. Historical landslide density (0 - 30 recurring events)
    historical_risk = np.clip(
        np.random.poisson(lam=8, size=n_samples) + np.random.normal(0, 2, size=n_samples),
        0,
        30,
    )

    # 7. Distance to road-cut / toe excavation in meters (10m - 500m)
    road_distance = np.clip(np.random.exponential(scale=150, size=n_samples) + 15, 10, 500)

    # 8. NDVI vegetation index (-0.1 to 0.85)
    ndvi = np.clip(0.65 - (rainfall24h / 1000) - np.random.normal(0, 0.12, size=n_samples), -0.1, 0.85)

    # Ground-truth geotechnical hazard score calculation (GSI & IMD NER thresholds)
    # 1. Rainfall component (Max 35 pts)
    rain_pts = np.where(
        rainfall24h >= 200,
        35.0,
        np.where(
            rainfall24h >= 150,
            28.0 + ((rainfall24h - 150) / 50.0) * 7.0,
            np.where(
                rainfall24h >= 100,
                20.0 + ((rainfall24h - 100) / 50.0) * 8.0,
                np.where(
                    rainfall24h >= 50,
                    10.0 + ((rainfall24h - 50) / 50.0) * 10.0,
                    (rainfall24h / 50.0) * 10.0,
                ),
            ),
        ),
    )
    rain_pts = np.where(rainfall72h > 200, np.minimum(35.0, rain_pts + 4.0), rain_pts)

    # 2. Soil Moisture saturation (Max 25 pts)
    moist_pts = np.where(
        soil_moisture >= 85,
        25.0,
        np.where(
            soil_moisture >= 70,
            18.0 + ((soil_moisture - 70) / 15.0) * 7.0,
            np.where(
                soil_moisture >= 50,
                10.0 + ((soil_moisture - 50) / 20.0) * 8.0,
                (soil_moisture / 50.0) * 10.0,
            ),
        ),
    )

    # 3. Slope gradient (Max 20 pts)
    slope_pts = np.where(
        slope >= 45,
        20.0,
        np.where(
            slope >= 35,
            14.0 + ((slope - 35) / 10.0) * 6.0,
            np.where(
                slope >= 25,
                8.0 + ((slope - 25) / 10.0) * 6.0,
                (slope / 25.0) * 8.0,
            ),
        ),
    )

    # 4. Historical susceptibility (Max 12 pts)
    hist_pts = np.minimum(12.0, (historical_risk / 25.0) * 12.0)

    # 5. Anthropogenic toe excavation & vegetation loss (Max 8 pts)
    terrain_pts = 3.0 + np.where(road_distance < 150, 3.0, 0.0) + np.where(ndvi < 0.4, 2.0, 0.0)

    total_risk = np.clip(
        rain_pts + moist_pts + slope_pts + hist_pts + terrain_pts + np.random.normal(0, 3.0, size=n_samples),
        0,
        100,
    )

    # Classification labels: 0=LOW (<=30), 1=MODERATE (31-70), 2=HIGH (>70)
    labels = np.zeros(n_samples, dtype=int)
    labels[(total_risk > 30) & (total_risk <= 70)] = 1
    labels[total_risk > 70] = 2

    df = pd.DataFrame(
        {
            "rainfall24h": rainfall24h,
            "rainfall72h": rainfall72h,
            "soilMoisture": soil_moisture,
            "slope": slope,
            "elevation": elevation,
            "historicalRisk": historical_risk,
            "roadDistance": road_distance,
            "ndvi": ndvi,
        }
    )

    return df, labels, total_risk

def train_and_save_model():
    print("=================================================================")
    print("⛰️  GIRI RAKSHA ML TRAINING: LANDSLIDE SUSCEPTIBILITY CLASSIFIER")
    print("=================================================================")
    print("Generating synthetic NER geotechnical dataset (3,000 samples)...")
    df, labels, risk_scores = generate_synthetic_ner_dataset(n_samples=3000)

    class_counts = np.bincount(labels)
    print(f"Sample breakdown: LOW={class_counts[0]}, MODERATE={class_counts[1]}, HIGH={class_counts[2]}")

    X_train, X_test, y_train, y_test = train_test_split(
        df, labels, test_size=0.2, random_state=42, stratify=labels
    )

    print("\nTraining Random Forest Ensemble (100 Estimators)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        class_weight="balanced",
    )
    clf.fit(X_train, y_train)

    # Evaluation
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n✓ Model Validation Accuracy: {acc * 100:.2f}% (Target: >87%)")
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["LOW", "MODERATE", "HIGH"]))

    # Save artifact
    output_dir = Path(__file__).resolve().parent.parent / "models"
    output_dir.mkdir(parents=True, exist_ok=True)
    model_path = output_dir / "landslide_rf_model.joblib"

    model_payload = {
        "model": clf,
        "feature_names": FEATURE_NAMES,
        "classes": ["LOW", "MODERATE", "HIGH"],
        "accuracy": float(acc),
    }

    joblib.dump(model_payload, model_path)
    print(f"✓ Trained model successfully serialized and saved to:\n  {model_path}")
    print("=================================================================")

    return model_path

if __name__ == "__main__":
    train_and_save_model()
