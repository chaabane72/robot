//% color=#2E8B57 icon="\uf1b9" block="RobotClub"
namespace robotclub {

    // =========================
    // CONFIGURATION DES BROCHES
    // =========================

    const AIN1 = DigitalPin.P13
    const AIN2 = DigitalPin.P14
    const PWMA = AnalogPin.P15

    const BIN1 = DigitalPin.P8
    const BIN2 = DigitalPin.P12
    const PWMB = AnalogPin.P16

    // =========================
    // FONCTION INTERNE MOTEUR A
    // =========================
    function moteurA(vitesse: number) {

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

        pins.analogWritePin(PWMA, Math.abs(vitesse) * 10)
    }

    // =========================
    // FONCTION INTERNE MOTEUR B
    // =========================
    function moteurB(vitesse: number) {

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

        pins.analogWritePin(PWMB, Math.abs(vitesse) * 10)
    }

    // =========================
    // BLOCS PUBLICS
    // =========================

    /**
     * Contrôle moteur gauche et droit
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
     * Avancer
     */
    //% block="avancer à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function avancer(vitesse: number): void {
        moteurA(vitesse)
        moteurB(vitesse)
    }

    /**
     * Reculer
     */
    //% block="reculer à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function reculer(vitesse: number): void {
        moteurA(-vitesse)
        moteurB(-vitesse)
    }

    /**
     * Tourner à droite
     */
    //% block="tourner à droite à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function tournerDroite(vitesse: number): void {
        moteurA(vitesse)
        moteurB(-vitesse)
    }

    /**
     * Tourner à gauche
     */
    //% block="tourner à gauche à %vitesse de puissance"
    //% vitesse.min=0 vitesse.max=100
    export function tournerGauche(vitesse: number): void {
        moteurA(-vitesse)
        moteurB(vitesse)
    }
}
