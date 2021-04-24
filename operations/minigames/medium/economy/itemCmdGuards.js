import { MESSAGES, USERS, SERVER, ITEMS, USABLE } from '../../../../origin/coop';


export function usableItemCodeGuard(msgRef, itemCode, username) {
    // Check if this item code can be given.
    if (!USABLE.isUsable(itemCode) || itemCode === null) {
        const errorText = `${username}, ${itemCode} is not a usable/matching item code.`;
        MESSAGES.selfDestruct(msgRef, errorText, 0, 5000);

        // Indicate that the code guard failed.
        return false;
    }

    // Indicate that the code guard passed.
    return true;
}

// TODO: Write this method to combine doesOwn and didUse into one command.
export async function doesOwnDidUseGuard(user, itemCode, qty, msgRef) {
    if (!await ownEnoughGuard(user, itemCode, qty, msgRef))
        return false;

    if (!await didUseGuard(user, itemCode, qty, msgRef))
        return false;

    // Guard passed.
    return true;
}

// TODO: Break these into separate files as export default functions.
export async function usedOwnedUsableGuard(user, itemCode, qty, msgRef) {
    // Check item code is usable and valid with command guard.
    const isUsable = usableItemCodeGuard(msgRef, itemCode, user.username);
    if (!isUsable) return false;

    // Check they own it and it was consumed.
    const used = await doesOwnDidUseGuard(user, itemCode, qty, msgRef);
    if (!used) return false;

    // Guard passed.
    return true;
}

// Check has enough of many and then use them or provide clear feedback error.
export async function useManyGuard(user, msg, itemManifest) {
    try {
        // Check has enough first and fall back to its error.
        const ownEnoughMany = await ownEnoughManyGuard(user, msg, itemManifest);
        if (!ownEnoughMany) return false;

        // Access the items that we are checking for.
        const itemCodes = Object.keys(itemManifest);

        // Load the user's owned item qty.
        const hasAll = await Promise.all(itemCodes.map(async (itemCode) => {
            // required: itemManifestQty,
            // has: 0
            const itemManifestQty = itemManifest[itemCode];

            const result = {
                used: false,
                item: itemCode,
            };

            // Indicate guard failed.
            const wasUsed = await USABLE.use(user.id, itemCode, itemManifestQty);
            if (wasUsed) result.used = true;

            return result;
        }));

        // Check all sufficient and either pass guard or provide error feedback.
        console.log('used all', hasAll.every(item => item.used));
        if (hasAll.every(item => item.used)) {
            return true;

        } else {
            // TODO: Definitely improve error

            // Ensure sufficient qty guard passes.
            // const notEnoughText = `${user.username} do not own enough ${itemCode}. ${itemQty}/${qty}`
            const notEnoughText = 'Not enough of those items... I got data. ;)'
            MESSAGES.selfDestruct(msg, notEnoughText, 0, 10000);

            return false;
        }
        

    } catch(e) {
        console.log('Error running useManyGuard');
        console.error(e);

        return false;
    }
}

export async function ownEnoughGuard(user, itemCode, qty, msgRef) {
    try {
        // Load the user's owned item qty.
        const itemQty = await ITEMS.getUserItemQty(user.id, itemCode);
        const emoji = MESSAGES._displayEmojiCode(itemCode);
        if (itemQty < 0 || itemQty - qty < 0) {
            const displayItemQty = ITEMS.displayQty(itemQty);
            const itemStatusText = `<@${user.id}> does not own enough ${emoji} (${itemCode})`;
            const notEnoughText = `${itemStatusText}: ${displayItemQty}/${qty}`
            MESSAGES.silentSelfDestruct(msgRef, notEnoughText, 0, 10000);

            // Indicate guard failed.
            return false;
        }

        // Ensure sufficient qty guard passes.
        if (itemQty - qty >= 0) return true;

    } catch(e) {
        console.log('Error running ownEnoughGuard');
        console.error(e);

        return false;
    }
}

export async function ownEnoughManyGuard(user, msg, itemManifest) {
    try {
        // Access the items that we are checking for.
        const itemCodes = Object.keys(itemManifest);

        // Load the user's owned item qty.
        const hasAll = await Promise.all(itemCodes.map(async (itemCode) => {
            const itemManifestQty = itemManifest[itemCode];

            const result = {
                sufficient: false,
                item: itemCode,
                required: itemManifestQty,
                has: 0
            };

            // Indicate guard failed.
            const itemQty = await ITEMS.getUserItemQty(user.id, itemCode);

            // Update result object with information for clearer result.
            result.has = itemQty;

            // Mark this one as sufficient/valid.
            if (itemQty - itemManifestQty >= 0) result.sufficient = true;

            return result;
        }));

        // Check all sufficient and either pass guard or provide error feedback.
        if (hasAll.every(item => item.sufficient)) {
            return true;

        } else {
            // Ensure sufficient qty guard passes.
            const notEnoughText = `${user.username}, you have insufficient items for that action:\n` +
                // Only give details on what is insufficient.
                hasAll.filter(itemCheck => !itemCheck.sufficient)
                
                    // Format it.
                    .map(itemCheck => `${MESSAGES._displayEmojiCode(itemCheck.item)} ${itemCheck.item}` + 
                        ` ${itemCheck.has}/${itemCheck.required}`)
                    .join(', ') + '.';
            
            // Destroy warning automatically.
            MESSAGES.selfDestruct(msg, notEnoughText, 0, 10000);

            return false;
        }
        

    } catch(e) {
        console.log('Error running ownEnoughManyGuard');
        console.error(e);

        return false;
    }
}

// Maybe change emoji to emoji code...?
export async function didUseGuard(user, itemCode, qty = 1, msgRef, reactEmoji = null) {
    try {
        // Attempt to use the shield item
        const didUseItem = await USABLE.use(user.id, itemCode, qty);
    
        // Provide error feedback, since this prevents action.
        if (didUseItem) return true;
        else {
            // Send the error.
            const insufficientText = `${user.username} you're unable to use ${itemCode}, you own none.`;
            const errorMsg = await MESSAGES.selfDestruct(msgRef, insufficientText, 0, 3000);

            if (reactEmoji)
                MESSAGES.delayReact(errorMsg, reactEmoji, 1333);

            // Indicate to executor that this does not pass.
            return false;
        }
    } catch(e) {
        console.log('Error running didUseGuard');
        console.error(e);

        return false;
    }
}



export function validUserArgGuard(msgRef, target, username) {
    // Check if this item code can be given.
    const targetMember = USERS.getMemberByID(SERVER._coop(), target.id);
    if (!target || !targetMember) {
        const errorText = `${username}, the user you tried to reference (${target}) is invalid.`;
        MESSAGES.selfDestruct(msgRef, errorText, 0, 5000);

        return false;
    }

    // Indicate guard passed.
    return true;
}



export function validItemQtyArgFloatGuard(msgRef, user, qty) {
    // Parse into a presumably valid float.
    const floatQty = parseFloat(qty);

    // Check if above 0
    if (isNaN(floatQty)) {
        const invalidErrorText = `<@${user.id}>, the given quantity is invalid ${qty}.`;
        MESSAGES.silentSelfDestruct(msgRef, invalidErrorText, 0, 5000);
        return false;
    }
    
    // Check if item qty argument given as command arg input is valid.
    if (floatQty <= 0) {
        const belowZeroText = `<@${user.id}>, quantity input must be above 0.`;
        MESSAGES.silentSelfDestruct(msgRef, belowZeroText, 0, 5000);
        return false;
    }

    // Indicate guard passed.
    return true;
}



export const itemQtyArg = {
    key: 'qty',
    prompt: 'Please enter item quantity.',
    type: 'float',
    default: 1
};

export const itemQtyArgInt = {
    key: 'qty',
    prompt: 'Please enter item quantity.',
    type: 'integer',
    default: 1
};

export const itemCodeArg = {
    key: 'itemCode',
    prompt: 'Please enter item code, item name, or item emoji.',
    type: 'string',
    default: ''
};