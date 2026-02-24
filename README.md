# Extension TB6612FNG – Robot micro:bit

![Robot TB6612](tb6612_robot.png)

---

# Extension TB6612FNG (blocs type Motorbit) – micro:bit

Cette extension permet de piloter **2 moteurs DC** via un **driver TB6612FNG** avec un câblage **fixe** (celui du projet).

---

## 1) Câblage (micro:bit ↔ TB6612FNG ↔ moteurs)

### Alimentation (obligatoire)
- **VCC (TB6612)** → **3V (micro:bit)**  
- **GND (TB6612)** → **GND (micro:bit)**  
- **VM (TB6612)** → **+ Batterie moteurs** (ex : 6V à 9V)  
- **GND Batterie** → **GND commun** (même masse que micro:bit et TB6612)
- **STBY (TB6612)** → **3V (micro:bit)**  ✅ indispensable (sinon les moteurs ne tournent pas)

⚠️ **Toutes les masses (GND) doivent être reliées ensemble** : micro:bit + TB6612 + batterie.

---

## 2) Broches utilisées (câblage fixe)

### Moteur gauche (Moteur A sur TB6612)
- **AIN1** → **P13**
- **AIN2** → **P14**
- **PWMA** → **P15**
- **A01 / A02** → bornes du **moteur gauche**

### Moteur droit (Moteur B sur TB6612)
- **BIN1** → **P8**
- **BIN2** → **P12**
- **PWMB** → **P16**
- **B01 / B02** → bornes du **moteur droit**

---

## 3) Rappel des broches TB6612FNG (module)

Côté logique :
- PWMA, AIN2, AIN1, STBY, BIN1, BIN2, PWMB, GND

Côté puissance / moteurs :
- VM, VCC, GND, A01, A02, B01, B02, GND

---

## 4) Blocs disponibles

- **moteur gauche … moteur droit …** : réglage direct en % (-100..100)
- **arrêter les moteurs**
- **avancer à … de puissance**
- **reculer à … de puissance**
- **tourner à gauche à … de puissance**
- **tourner à droite à … de puissance**

---

## 5) Conseils / Dépannage rapide

✅ Si un moteur ne tourne pas :
1. Vérifier que **STBY est bien relié au 3V**
2. Vérifier que **PWMA/PWMB** sont bien branchées (P15 / P16)
3. Vérifier la **masse commune** (GND micro:bit = GND TB6612 = GND batterie)
4. Vérifier que **VM** est bien alimenté par la batterie

⚠️ Ne jamais alimenter les moteurs avec le 3V du micro:bit.
