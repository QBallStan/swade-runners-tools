import * as gb from './../gb.js';
export default class BasicRoll {

    constructor() {
        // this.rsCount=[];
        this.critical = null;
        this.raise = null;
        this.targetNumber = 4;
        this.roll;
        this.diceModifier = '';

        this.runDie = false;
    }

    prepareModifier(modifier) {
        modifier = parseInt(modifier) || 0;

        if (modifier > 0) {
            modifier = `+${modifier}`;
        } else if (modifier == 0) {
            modifier = '';
        }

        if (this.diceModifier) {
            this.diceModifier = this.explodeAllDice(this.diceModifier);
        }

        return this.diceModifier + modifier;
    }

    addDiceModifier(dieMod) {

        dieMod = gb.stringDiceMod(dieMod);
        this.diceModifier += dieMod;
        return dieMod;
    }

    isRunDie() {
        this.runDie = true;
    }

    async buildRoll(dieType, wildDie, modifier = 0, rof) {

        if (!parseInt(rof)) {
            rof = 1;
        }

        let rollExp;
        if (rof > 1) {

            let rofExp = '';
            let wildExp = '';
            let mod = this.prepareModifier(modifier);

            if (typeof mod == "string" && mod.includes('d')) {
                let modRoll = await new Roll(mod).roll({ async: true });
                mod = modRoll.total;
                if (mod > 0) {
                    mod = '+' + mod;
                }

                this.addFlavor(`<div>${gb.trans('RoFFinalMod')}: ${mod}</div>`, true);
            }

            for (let i = 1; i < rof; i++) {
                rofExp += `,1d${dieType}x${mod}`

            }

            if (wildDie) {
                wildExp = `,1d${wildDie}x${mod}`
            }

            rollExp = `{1d${dieType}x${mod}${rofExp}${wildExp}}`

        } else {

            let x = 'x';
            if (this.runDie) {
                x = '';
            }

            if (!wildDie) {
                rollExp = `1d${dieType}${x}${this.prepareModifier(modifier)}`;
            } else {
                rollExp = `{1d${dieType}x,1d${wildDie}x}kh${this.prepareModifier(modifier)}`
            }
        }

       

        

      //  this.roll = await new Roll(rollExp).roll({ async: true });  /// removed due to SWADE SYSTEM 2.3
        /// NEW CODE FOR ROLL
      this.roll = new CONFIG.Dice.SwadeRoll(rollExp, {}, {});
        await this.roll.evaluate();
        //// END NEW CODE FOR ROLL

        this.addDiceFlavor(rof, wildDie);

       

        return this.roll;
    }

    addDiceFlavor(rof, wildDie) {

        let wildkey;
        //   console.log(this.roll);
        let i = 0;

        if (rof > 1) {

            if (this.skillName) {
                while (i < rof) {
                    this.roll.terms[0].dice[i].options.flavor = this.skillName;
                    i++;
                }
            }

            if (wildDie) {
                this.roll.terms[0].dice[i].options.flavor = gb.trans('WildDie', 'SWADE');
                wildkey = i;
            }

            i++

        } else {

            i = 2;
            if (this.skillName && wildDie) {
                this.roll.terms[0].dice[0].options.flavor = this.skillName;
            } else if (this.runDie) {
                this.roll.terms[0].options.flavor = gb.trans('Running', 'SWADE');

            } else {
                this.roll.terms[0].options.flavor = this.skillName;
            }

            if (wildDie) {
                this.roll.terms[0].dice[1].options.flavor = gb.trans('WildDie', 'SWADE');
                wildkey = 1;
            }
        }

        /// extra dice
        //console.log(this.roll.terms);
        // console.log(i,this.roll.terms[0]?.dice[i]);
        while (this.roll.terms[0]?.dice?.[i] !== undefined) {
            this.roll.terms[0].dice[i].options.flavor = gb.trans('Modifier', 'SWADE')
            i++;
        }

        if (wildDie) {
            this.colorWild(wildkey);
        }
    }

    colorWild(wildKey) {
        if (!!game.dice3d) {
            //  let colorPreset='none';
            const colorPreset = game.user.getFlag('swade', 'dsnWildDie') || 'none';
            if (colorPreset !== 'none') {
                this.roll.terms[0].dice[wildKey].options.colorset = colorPreset;
            }
        }
    }

    async buildDamageRoll(damage, modifier, raise, raisedie = 6) {

        damage = this.explodeAllDice(damage);
        //console.log(raisedie);
        let raiseAdd = ''
        if (raise) {
            raiseAdd = '+1d' + raisedie + 'x'
        }

        this.roll = new CONFIG.Dice.SwadeRoll(`${damage}${raiseAdd}${this.prepareModifier(modifier)}`, {}, {});
        await this.roll.evaluate();
        /// this.roll = await new Roll(`${damage}${raiseAdd}${this.prepareModifier(modifier)}`).roll({ async: true }); /// removed due to SWADE 2.3
       
        return this.roll;
    }

    explodeAllDice(weaponDamage) {
        return gb.explodeAllDice(weaponDamage);
    }

    raiseCount(targetNumber = 4) { ///totalbonus => for vulnerable
        /* 
        <0=>Failure;
        0=>success
        1+=>raises (return number of raises) 
        */

        return gb.raiseCount(this.roll.total, targetNumber);

        /* let key=`${targetNumber}x${totalbonus}`
    
        if (this.rsCount[key]===undefined){
    
            let total=this.roll.total+totalbonus;
           
            this.rsCount[key]=Math.floor((total-targetNumber)/4)
    
            
        }
    
        return this.rsCount[key]; */
    }

    isSuccess() {

        if (this.raiseCount() >= 0) {
            return true;
        } else {
            return false;
        }
    }

    /* isCritical(){
 
    } */
}