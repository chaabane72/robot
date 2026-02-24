//% color=#0fbc11 weight=100 icon="\uf1b9"
//% block="motorbit"
namespace motorbit {

    // =========================
    // CÂBLAGE FIXE TB6612FNG
    // =========================
    // Moteur gauche (A): AIN1=P13, AIN2=P14, PWMA=P15
    // Moteur droit  (B): BIN1=P8,  BIN2=P12, PWMB=P16
    // STBY doit être relié au 3V (obligatoire)

    function clamp100(x: number): number {
        if (x > 100) return 100
        if (x < -100) return -100
        return x
    }

    function pctToPwm(pct: number): number {
        // pct in [0..100] => pwm in [0..1023]
        if (pct < 0) pct = 0
        if (pct > 100) pct = 100
        return Math.idiv(pct * 1023, 100)
    }

    function setLeft(pct: number): void {
        pct = clamp100(pct)
        if (pct > 0) {
            // Avant
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P14, 0)
            pins.analogWritePin(AnalogPin.P15, pctToPwm(pct))
        } else if (pct < 0) {
            // Arrière
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 1)
            pins.analogWritePin(AnalogPin.P15, pctToPwm(-pct))
        } else {
            // Stop
            pins.analogWritePin(AnalogPin.P15, 0)
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, 0)
        }
    }

    function setRight(pct: number): void {
        pct = clamp100(pct)
        if (pct > 0) {
            // Avant
            pins.digitalWritePin(DigitalPin.P8, 1)
            pins.digitalWritePin(DigitalPin.P12, 0)
            pins.analogWritePin(AnalogPin.P16, pctToPwm(pct))
        } else if (pct < 0) {
            // Arrière
            pins.digitalWritePin(DigitalPin.P8, 0)
            pins.digitalWritePin(DigitalPin.P12, 1)
            pins.analogWritePin(AnalogPin.P16, pctToPwm(-pct))
        } else {
            // Stop
            pins.analogWritePin(AnalogPin.P16, 0)
            pins.digitalWritePin(DigitalPin.P8, 0)
            pins.digitalWritePin(DigitalPin.P12, 0)
        }
    }

    /**
     * Réglage direct : moteur gauche / moteur droit en %
     * -100..100 (négatif = arrière, positif = avant)
     */
    //% blockId=motorbit_moteurs block="moteur gauche %m moteur droit %n"
    //% m.min=-100 m.max=100 m.defl=0
    //% n.min=-100 n.max=100 n.defl=0
    export function moteurs(m: number, n: number): void {
        setLeft(m)
        setRight(n)
    }

    /**
     * Arrêter les moteurs
     */
    //% blockId=motorbit_stop block="arrêter les moteurs"
    export function stop(): void {
        setLeft(0)
        setRight(0)
    }

    /**
     * Avancer (0..100)
     */
    //% blockId=motorbit_avancer block="avancer à %n de puissance"
    //% n.min=0 n.max=100 n.defl=50
    export function avancer(n: number): void {
        if (n < 0) n = 0
        if (n > 100) n = 100
        setLeft(n)
        setRight(n)
    }

    /**
     * Reculer (0..100)
     */
    //% blockId=motorbit_reculer block="reculer à %n de puissance"
    //% n.min=0 n.max=100 n.defl=50
    export function reculer(n: number): void {
        if (n < 0) n = 0
        if (n > 100) n = 100
        setLeft(-n)
        setRight(-n)
    }

    /**
     * Tourner à gauche (0..100) : gauche stop, droite avance
     */
    //% blockId=motorbit_tourner_gauche block="tourner à gauche à %n de puissance"
    //% n.min=0 n.max=100 n.defl=50
    export function tournerGauche(n: number): void {
        if (n < 0) n = 0
        if (n > 100) n = 100
        setLeft(0)
        setRight(n)
    }

    /**
     * Tourner à droite (0..100) : droite stop, gauche avance
     */
    //% blockId=motorbit_tourner_droite block="tourner à droite à %n de puissance"
    //% n.min=0 n.max=100 n.defl=50
    export function tournerDroite(n: number): void {
        if (n < 0) n = 0
        if (n > 100) n = 100
        setRight(0)
        setLeft(n)
    }
}
