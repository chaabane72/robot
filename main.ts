// =========================
// RobotClub - TB6612FNG + Ultrason
// Câblage moteurs (fixe) :
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

    /**
     * Contrôle moteur gauche et droit (-100..100)
     */
    //% block="moteur gauche %gauche moteur droit %droit"
    //% gauche.min=-100 gauche.max=100
    //% droit.min=-100 droit.max=100
    export function moteurs(gauche: number, droit: number): void {
        moteurA(gauche)
        moteurB(droit)
    }

    /**
     * Arrêter les moteurs
     */
    //% block="arrêter les moteurs"
    export function stop(): void {
        moteurA(0)
        moteurB(0)
    }

    /**
     * Avancer (0..100)
     */
    //% block="avancer à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function avancer(vitesse: number): void {
        moteurA(vitesse)
        moteurB(vitesse)
    }

    /**
     * Reculer (0..100)
     */
    //% block="reculer à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function reculer(vitesse: number): void {
        moteurA(-vitesse)
        moteurB(-vitesse)
    }

    /**
     * Tourner à droite sur place (0..100)
     */
    //% block="tourner à droite à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function tournerDroite(vitesse: number): void {
        moteurA(vitesse)
        moteurB(-vitesse)
    }

    /**
     * Tourner à gauche sur place (0..100)
     */
    //% block="tourner à gauche à %vitesse de puissance"
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

    /**
     * Distance ultrason en centimètres (TRIG=P1, ECHO=P2)
     */
    //% block="distance ultrason (cm)"
    export function distanceCm(): number {

        // impulsion TRIG
        pins.digitalWritePin(TRIG, 0)
        control.waitMicros(2)
        pins.digitalWritePin(TRIG, 1)
        control.waitMicros(10)
        pins.digitalWritePin(TRIG, 0)

        // mesure ECHO (µs)
        const duration = pins.pulseIn(ECHO, PulseValue.High, 25000)

        // conversion approx : cm = µs / 58
        const cm = Math.idiv(duration, 58)

        return cm
    }

    /**
     * Renvoie VRAI si un obstacle est plus proche que "seuilCm"
     */
    //% block="obstacle à moins de %seuilCm cm"
    //% seuilCm.min=1 seuilCm.max=200 seuilCm.defl=10
    export function obstacleProche(seuilCm: number): boolean {
        return distanceCm() > 0 && distanceCm() < seuilCm
    }
}
