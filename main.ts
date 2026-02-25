// =========================
// RobotClub - TB6612FNG + Ultrason
// Moteurs (fixe) :
//  - Moteur A (gauche) : P13 / P14 / P15
//  - Moteur B (droit)  : P8  / P12 / P16
// Ultrason (fixe) : TRIG=P1, ECHO=P2
// ⚠️ Si HC-SR04 (5V) : ECHO doit être abaissé à 3.3V (diviseur de tension)
// =========================


//% color=#2E8B57 icon="\uf1b9" block="RobotClub"
namespace robotclub {

    const AIN1 = DigitalPin.P13
    const AIN2 = DigitalPin.P14
    const PWMA = AnalogPin.P15

    const BIN1 = DigitalPin.P8
    const BIN2 = DigitalPin.P12
    const PWMB = AnalogPin.P16

    function clamp100(v: number): number {
        if (v > 100) return 100
        if (v < -100) return -100
        return v
    }

    function pctToPwm(v: number): number {
        // 0..100 -> 0..1023
        if (v < 0) v = 0
        if (v > 100) v = 100
        return Math.idiv(v * 1023, 100)
    }

    function moteurA(vitesse: number) {
        vitesse = clamp100(vitesse)

        if (vitesse > 0) {
            pins.digitalWritePin(AIN1, 1)
            pins.digitalWritePin(AIN2, 0)
        } else if (vitesse < 0) {
            pins.digitalWritePin(AIN1, 0)
            pins.digitalWritePin(AIN2, 1)
        } else {
            pins.digitalWritePin(AIN1, 0)
            pins.digitalWritePin(AIN2, 0)
        }

        pins.analogWritePin(PWMA, pctToPwm(Math.abs(vitesse)))
    }

    function moteurB(vitesse: number) {
        vitesse = clamp100(vitesse)

        if (vitesse > 0) {
            pins.digitalWritePin(BIN1, 1)
            pins.digitalWritePin(BIN2, 0)
        } else if (vitesse < 0) {
            pins.digitalWritePin(BIN1, 0)
            pins.digitalWritePin(BIN2, 1)
        } else {
            pins.digitalWritePin(BIN1, 0)
            pins.digitalWritePin(BIN2, 0)
        }

        pins.analogWritePin(PWMB, pctToPwm(Math.abs(vitesse)))
    }

    // =========================
    // BLOCS MOTEURS
    // =========================

    //% group="Moteurs" block="moteur gauche %gauche moteur droit %droit"
    //% gauche.min=-100 gauche.max=100
    //% droit.min=-100 droit.max=100
    export function moteurs(gauche: number, droit: number): void {
        moteurA(gauche)
        moteurB(droit)
    }

    //% group="Moteurs" block="arrêter les moteurs"
    export function stop(): void {
        moteurA(0)
        moteurB(0)
    }

    //% group="Moteurs" block="avancer à %vitesse % de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function avancer(vitesse: number): void {
        moteurA(vitesse)
        moteurB(vitesse)
    }

    //% group="Moteurs" block="reculer à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function reculer(vitesse: number): void {
        moteurA(-vitesse)
        moteurB(-vitesse)
    }

    //% group="Moteurs" block="tourner à droite à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function tournerDroite(vitesse: number): void {
        moteurA(vitesse)
        moteurB(-vitesse)
    }

    //% group="Moteurs" block="tourner à gauche à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function tournerGauche(vitesse: number): void {
        moteurA(-vitesse)
        moteurB(vitesse)
    }
}



//% color=#1E90FF icon="\uf2a0" block="RobotClub Ultrason"
namespace robotclub_ultrason {

    const TRIG = DigitalPin.P1
    const ECHO = DigitalPin.P2

    function clampRange(v: number, min: number, max: number): number {
        if (v < min) return min
        if (v > max) return max
        return v
    }

    /**
     * Distance ultrason en centimètres (TRIG=P1, ECHO=P2)
     */
    //% group="Ultrason" block="distance ultrason (cm)"
    export function distanceUltrasonCm(): number {
        pins.digitalWritePin(TRIG, 0)
        control.waitMicros(2)
        pins.digitalWritePin(TRIG, 1)
        control.waitMicros(10)
        pins.digitalWritePin(TRIG, 0)

        const duration = pins.pulseIn(ECHO, PulseValue.High, 25000)
        const cm = Math.idiv(duration, 58)

        // Valeurs 0 = pas de mesure (hors portée / timeout)
        if (cm <= 0) return 0

        // limite raisonnable pour éviter des valeurs absurdes
        return clampRange(cm, 1, 300)
    }

    /**
     * Vrai si obstacle plus proche que le seuil
     */
    //% group="Ultrason" block="obstacle à moins de %seuil cm"
    //% seuil.min=1 seuil.max=300 seuil.defl=10
    export function obstacleMoinsDe(seuil: number): boolean {
        const d = distanceUltrasonCm()
        return d > 0 && d < seuil
    }

    /**
     * Vrai si obstacle plus loin que le seuil
     */
    //% group="Ultrason" block="obstacle à plus de %seuil cm"
    //% seuil.min=1 seuil.max=300 seuil.defl=20
    export function obstaclePlusDe(seuil: number): boolean {
        const d = distanceUltrasonCm()
        return d > seuil
    }

    /**
     * Vrai si obstacle entre min et max (inclus)
     */
    //% group="Ultrason" block="obstacle entre %min cm et %max cm"
    //% min.min=0 min.max=300 min.defl=5
    //% max.min=0 max.max=300 max.defl=20
    export function obstacleEntre(min: number, max: number): boolean {
        const d = distanceUltrasonCm()
        if (d <= 0) return false
        if (min > max) {
            // si l'utilisateur inverse, on corrige automatiquement
            const t = min
            min = max
            max = t
        }
        return d >= min && d <= max
    }
}
