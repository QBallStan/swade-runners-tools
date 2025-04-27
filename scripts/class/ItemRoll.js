import CharRoll from "./CharRoll.js";
import * as gb from './../gb.js';

export default class ItemRoll extends CharRoll{
    constructor(actor,item){
        super();
        this.actor=actor;
        this.item=item;
        this.data=item.system.actions;
        this.actions=this.data.additional;
        
        //this.combatRoll(this.item._id);

        this.addFlavor(item.name);
        this.isItem(item);


     //   console.log(this.manageshots);
        

        /* if (actor.data.type=='vehicle'){
            this.usingVehicle(actor);
            actor=game.actors.get(actor.data.data.driver.id);
            
        } */
      //  console.log(this.item);

    }




    async rollAction(actionId){
        let action=this.actions[actionId];

        this.defineAction(actionId);


        if (action.type=='trait'){

      


                  
          
           if (gb.realInt(action.resourcesUsed)>0){
            this.useShots(action.resourcesUsed);
            } 
            
            

            
           
           // this.addModifier(action.traitMod,action.name);
           this.addModifier(action.modifier,action.name); /// => changed name

            
            let rof=1;
            if (action.dice!==undefined){
               rof=action.dice;
            }

            let skill=this.data.trait;

           // console.log(skill,'skill1');
            
            if (action.override){
                skill=action.override;
            }

           // console.log(skill,'skill2');
            
            this.addSkillMod();

           
            
            await this.rollSkill(skill,rof);
            

        } else if (action.type=='damage'){
            this.addModifier(action.modifier,action.name);
            let damage=this.item.system?.damage;      
            
            

            if (action.override){
                damage=action.override;
            } /* else {
                
                ui.notifications.warn(gb.trans('NoDmgActionDefined'));
                
            } */

           

            this.addDmgMod();
            await this.rollDamage(damage,this.getApInfo(action),this.raiseDie());
        }

        
        

        
    }

    raiseDie(){
        let raisedie=6;
        if (this.item.system?.bonusDamageDie){
            raisedie=this.item.system.bonusDamageDie;
        }

        return raisedie;
    }

    /// universal mods
    addSkillMod(){
        this.addModifier(this.item.system.trademark,gb.trans('TrademarkWeapon.Label','SWADE'))
        this.addModifier(this.item.system.actions.traitMod,gb.trans('ModItem'));
        if (this.actor?.system?.stats?.globalMods?.attack && this.actor?.system?.stats?.globalMods?.attack.length > 0) {
            this.actor?.system?.stats?.globalMods?.attack.forEach(el => {
                this.addModifier(el.value,`${el.label} (${gb.trans('GlobalMod.Attack','SWADE')})`);
            });
        }
    }

    addDmgMod(){
        this.addModifier(this.data.dmgMod,gb.trans('ModItem'));        
       
        if (this.actor?.system?.stats?.globalMods?.damage && this.actor?.system?.stats?.globalMods?.damage.length > 0) {
            this.actor?.system?.stats?.globalMods?.damage.forEach(el => {
                this.addModifier(el.value,`${el.label} (${gb.trans('GlobalMod.Damage','SWADE')})`);
            });
        }

        // ✅ NEW: Melee-only conditional damage modifiers
        const isMelee = this.item?.type === 'weapon' && this.item.system?.rangeType === 0;
        if (isMelee) {
            const meleeBonus = this.actor?.flags?.['swade-tools']?.meleeDamage;
          
            if (Array.isArray(meleeBonus)) {
              meleeBonus.forEach(mod => {
                this.addModifier(mod.value, `${mod.label} (Melee Bonus)`);
              });
            } else if (typeof meleeBonus === 'number' || typeof meleeBonus === 'string') {
                let sourceName = "Melee Bonus";
              
                const sourceItem = this.actor.items.find(item =>
                  item.effects.some(eff =>
                    eff.changes.some(change => change.key === 'flags.swade-tools.meleeDamage')
                  )
                );
              
                if (sourceItem?.name) {
                  sourceName = sourceItem.name;
                }
              
                this.addModifier(meleeBonus, sourceName);
              }
          }
        
          // ✅ Shotgun Spread/Slug Rules
          const isShotgun = this.item?.system?.additionalStats?.isShotgun?.value;
          const usingSlug = this.item?.system?.additionalStats?.usingSlugAmmo?.value;
          
          if (isShotgun) {
            const origin = this.item.actor?.token ?? canvas.tokens.controlled[0];
            const targets = Array.from(game.user.targets);
          
            if (origin && targets.length > 0) {
              const targetToken = targets[0];
              const path = [origin.center, targetToken.center];
              const measure = canvas.grid.measurePath(path);
              const distance = measure.distance;
          
              const rangeString = this.item.system.range.split('/');
              const ranges = rangeString.map(r => parseInt(r.trim(), 10));
          
              let rangeBand = "short";
              if (distance > ranges[0]) rangeBand = "medium";
              if (distance > ranges[1]) rangeBand = "long";
              if (distance > ranges[2]) rangeBand = "extreme";
          
              if (usingSlug) {
                this.addModifier(2, "Slug Ammo Bonus");
              } else {
                if (rangeBand === "short") {
                  this.addModifier(2, "Shotgun Spread (Short Range)");
                } else if (rangeBand === "medium") {
                  // No modifier at medium range
                } else if (rangeBand === "long") {
                  this.addModifier(-2, "Shotgun Spread (Long Range)");
                } else if (rangeBand === "extreme") {
                  ui.notifications.warn("❌ Shotshells cannot fire at Extreme Range!");
                }
              }
            }
          }
          
    }
    ///

    useTarget(targetid){
        /// set the target for info
        this.usetarget=targetid;
    }

    usePP(extraPP){
        if (this.item.type=='power'){
            let usepp=gb.realInt(this.item.system.pp)+gb.realInt(extraPP);
            if (usepp<0){ /// min 0
                usepp=0
            }

           // console.log(usepp,'usepp');
            this.useShots(usepp);
        } else if (this.item.isArcaneDevice){
            this.useShots(gb.realInt(extraPP))
        }
    }

    


    async rollBaseSkill(rof=1){
        let rofstr='';
        if (rof>1){
            rofstr=rof;
        }
      
        this.defineAction('formula'+rofstr);
        this.addSkillMod();
      
        const modifiers = [];
      
        // ✅ Add range penalty modifier
        const item = this.item;
        const target = this.target;
      
        if (item?.system?.range?.includes('/') && target?.actor) {
          const rangeString = item.system.range.split('/');
          const ranges = rangeString.map(r => parseInt(r.trim(), 10));
          const origin = item.actor?.token;
          const targetToken = target.token ?? target;
      
          const distance = canvas.grid.measureDistance(origin, targetToken);
      
          let label = "Short";
          let penalty = 0;
      
          if (distance > ranges[0]) {
            label = "Medium";
            penalty = -2;
          }
          if (distance > ranges[1]) {
            label = "Long";
            penalty = -4;
          }
          if (distance > ranges[2] * 4) {
            label = "Too Far";
            penalty = -999;
          }
      
          if (penalty !== 0 && penalty !== -999) {
            modifiers.push({
              label: `Range Penalty (${label})`,
              value: penalty
            });
          }
        }
      
        // ✅ Perform the actual skill roll with visible modifiers
        await this.rollSkill(this.data.trait, rof, { modifiers });
      }
      

    getApInfo(action=false){
        let extrainfo='';

        let finalAp=this.item.system.ap;

        if (action && action?.ap){
            finalAp=action.ap;
        }
        let reason=[];

        if (this.actor?.system?.stats?.globalMods?.ap && this.actor?.system?.stats?.globalMods?.ap.length > 0) {
            this.actor?.system?.stats?.globalMods?.ap.forEach(el => {
                finalAp=finalAp+el.value
                reason.push(`${el.label}: ${el.value}`)
            });

            if (finalAp<0){
                finalAp=0
            }
        }

        if (this.item.system.ap){
            extrainfo+=` [${gb.trans('Ap','SWADE')}: ${finalAp}`;
        

        if (reason.length>0){
            extrainfo+=` (${reason.join(', ')})`
        }

            extrainfo+=`]`
      
        }

        return extrainfo;
    }

    async rollBaseDamage(){
        this.defineAction('damage');
        this.addDmgMod();
        /* let extrainfo='';

        let finalAp=this.item.system.ap;
        let reason=[];

        if (this.actor?.system?.stats?.globalMods?.ap && this.actor?.system?.stats?.globalMods?.ap.length > 0) {
            this.actor?.system?.stats?.globalMods?.ap.forEach(el => {
                finalAp=finalAp+el.value
                reason.push(`${el.label}: ${el.value}`)
            });

            if (finalAp<0){
                finalAp=0
            }
        }

        if (this.item.system.ap){
            extrainfo+=` [${gb.trans('Ap','SWADE')}: ${finalAp}`;
        

        if (reason.length>0){
            extrainfo+=` (${reason.join(', ')})`
        }

            extrainfo+=`]`
      
        } */

        
        
        await this.rollDamage(this.item.system.damage,this.getApInfo(),this.raiseDie());
    }

    
}