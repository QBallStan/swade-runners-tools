# SWADE Tools

## Compatibility 
SWADE Tools v1.16.x is only compatible with with Foundry v12 and SWADE system v4

## Buy me a coffee
If you like the module and want to buy me a coffee: https://ko-fi.com/lipefl

## About the Module
A series of automations and quality of life improvements to use with SWADE system.

### Automation on Combat
- Detect targets in combat, **show hit/raise, damage and soak rolls**. All calculations automatically, just click to apply/roll.
- Automatic Situational modifiers for targets: **Distance, Gang Up, Ranged in Melee, Scale** etc. It's shown hidden by default, always if you want.
- Auto **Remove/Roll Status during combat**, no need to check or confirm
- **Min Str** affects damage dice (for Strength) and also trait rolls based on armor equipped or ranged weapon. Edges like Soldier are detected automatically.
- **Conviction support**: At the end of conviction, you are asked if you want to spend a benny to keep it active for another round.
- **Auto detect egdes/abilities** for bonus on rolls based on their names (support to some settings, allow to change names).
- Suport for **Cover** through items.
- **Out of control** will roll the table automatically for vehicle combat
- Suport for **setting rules** based on the swade system config
- **GM benny** will be used from directly from NPC if they have it, or from GM pool. Automatically!

### Automations to spare the GM
- **Auto Update Max Wounds** based on Wildcard/Extra and Size
- **Automatically link (and unlink) tokens** if the actor is wildcard (or not)
- **Auto Update Token** width/height based on Size.
- PCs are **friendly**, NPCs are **hostile** by default

### User Friendly for beginners
- **Simpler rolls**: by default, a simple dialog box with modifier when rolling Attributes and Skills. Same principle is applied to weapons and powers: a dialog box instead of sending to chat. The only player seeing it is the player using it.
- **More visible icons** for status, wound and fatigue
- **Clean and simple roll in the chat**. With tiny button to rerrol with benny or free reroll. For the GM, extra buttons to add modifier (after roll), re-targeting or calculate raises.
- **Template buttons for powers** directly, with just one click
- Asks when a weapon/power don't have a **defined trait** and redefine it for the roll
- Visible **Critical Failure** in the chat 

### Macros
- Easier **Boost/Lower Trait**
- Mark all PCs as **Friendly** and NPCs as **Hostile**. For those who haven't been using SWADE Tools.
- **Attack macro** to simplify for the GM
- **Roll once for all selected**, using the same trait

### Add More Things (if you want)
- Suport for **Called Shots**
- Quick select Aditional Modifiers: **Multi-Actions, Cover, Illumination**

### Missing something?
Open an issue: https://github.com/lipefl/swade-tools/issues

## Screenshots
![](https://i.imgur.com/K94IRoK.jpg)

![](https://i.imgur.com/2Y5tLRv.jpg)

![](https://i.imgur.com/IHdNOCA.jpg)

![](https://i.imgur.com/9On5gNC.jpg)

![](https://i.imgur.com/ibkM5Fa.jpg)

![](https://i.imgur.com/2mWd5oI.jpg)

![](https://i.imgur.com/h71BtgJ.jpg)

![](https://i.imgur.com/xJRCMxe.jpg)

![](https://i.imgur.com/1Ld0v0X.jpg)

![](https://i.imgur.com/yl7yhZz.jpg)

![](https://i.imgur.com/D46Aybk.jpg)

![](https://i.imgur.com/BexudNg.jpg)

## Translation
If you want your language handled by gitlocalize.com (a much easier interface), please open an issue.

## Last Update
Check The Releases!
For versions previous to v1.12, check: https://github.com/lipefl/swade-tools/blob/main/UPDATEHISTORY.md

## Installation Link
https://raw.githubusercontent.com/lipefl/swade-tools/main/module.json

## Internal helper functions

async game.swadetools.attribute(actor,attribute)  => attribute dialog

async game.swadetools.skill(actor,skillItemId) => skill dialog

async game.swadetools.run(actor) => run dialog

game.swadetools.item(actor,itemId) => item dialog

# **Savage Tools Fork – Savage Runners Custom Features**

### 🎯 **Roll & Chat Card Enhancements**

- **Skill Specializations**
  
  - Shows a checkbox in the roll dialog if `system.additionalStats.spec.value` is set.
    
  - Unchecking applies a –2 penalty to simulate rolling without specialization.
    
- **Resist Rolls in Chat**
  
  - Actions (e.g., spells, powers) can now include a *resist roll button*.
    
  - The targeted actor clicks it to roll the appropriate defense skill.
    
- **Conditional Modifiers in Chat**
  
  - Roll dialog modifiers now appear in the chat card instead.
    
  - Can be toggled *per target* instead of affecting all at once.
    
- **Cover Armor Button**
  
  - Appears only on **damage rolls**.
    
  - Adds armor bonuses based on active cover (see Cover System below).
    

---

### 🛡️ **Cover System via Token HUD**

- New **"Cover Options"** button on the token HUD (top-right when selecting a token).
  
- Opens a menu with the following icons:
  
  - 🛡️ No Cover
    
  - 🛡️ Light Cover (–2)
    
  - 🛡️ Medium Cover (–4)
    
  - 🛡️ Heavy Cover (–6)
    
  - 🛡️ Near Total Cover (–8)
    
- Sets `flags.swade-tools.coverLevel` on the token.
  
- Used by the roll system to adjust armor when the **Cover Armor** button is clicked.
  

---

### 💥 **Combat Features**

- **Called Shot Armor Penalty**
  
  - Automatically reduces armor on damage rolls if a called shot was made.
- **Melee-Specific Effects**
  
  - Active Effects can now apply **only on melee attacks** using:
    
    json
    
- **Wound-Based Automation**
  
  - Status icons and effect processing now include wound condition tracking.
    
  - Improved display of wounded actors and relevant penalties.
    

---

### 🔫 **Ammo & Magazine Handling**

- **Ammo Type Display in roll window**  
  Ammo type now reflects the **loaded magazine** (`system.additionalStats.ammo.value`).
  
- **Damage Mode Auto-Selection**  
  If a weapon has multiple damage actions, it automatically selects the one matching the loaded ammo.
  
- **Magazine Integration**
  
  - 📤 **Eject Button**: Weapons using magazines have an eject button. Clicking it unequips the mag.
    
  - 🔄 **Reload Button**: Clicking on a magazine item opens a reload dialog.
    
    - Finds compatible magazines using the `ammo.value` stat.
      
    - Only magazines with matching ammo type will be listed.Roll dialog fetches magazine info and applies ammo type and current rounds.
      

---

### ⚙️ **Miscellaneous Improvements**

- **Custom Toggle Buttons**
  
  - Added toggle buttons to chat and roll dialogs for special rules (cover, specialization, resist, etc.).



