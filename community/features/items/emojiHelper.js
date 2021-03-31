import RAW_EMOJIS from '../../../core/config/rawemojis.json';

export default class EmojiHelper {

    static rawEmojiToCode(rawEmoji) {
        let itemCode = null;
        
        Object.keys(RAW_EMOJIS).map(rawKey => {
            if (RAW_EMOJIS[rawKey] === rawEmoji) itemCode = rawKey;
        });

        return itemCode;
    }



}