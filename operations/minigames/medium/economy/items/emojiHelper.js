import { RAW_EMOJIS } from '../../../../../origin/config';

export default class EmojiHelper {

    static rawEmojiToCode(rawEmoji) {
        let itemCode = null;
        
        Object.keys(RAW_EMOJIS).map(rawKey => {
            if (RAW_EMOJIS[rawKey] === rawEmoji) itemCode = rawKey;
        });

        return itemCode;
    }



}