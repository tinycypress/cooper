import COOP, { SERVER } from '../../../../origin/coop';
import { ROLES } from '../../../../origin/config';


export default class RolesHelper {

    static _allWith(roleCode) {
        const role = ROLES[roleCode].id || null;
        if (!role) return [];
        return COOP.USERS._cache()
            .filter(member => member.roles.cache.has(role));
    }

    static _allWithout(roleCode) {
        const role = ROLES[roleCode].id || null;
        if (!role) return [];
        return COOP.USERS._cache()
            .filter(member => !member.roles.cache.has(role));
    }

    static getRoles(guild, rolesSelection) {
        return guild.roles.cache.filter(r => rolesSelection.includes(r.name));
    }
    static getRolesByID(guild, rolesSelection) {
        return guild.roles.cache.filter(r => rolesSelection.includes(r.id));
    }
    static getRoleByID(guild, roleID) {
        return guild.roles.cache.get(roleID);
    }

    static _get(roleID) {
        return this.getRoleByID(SERVER._coop(), roleID);
    }

    static _getByCode(roleCode) {
        return this.getRoleByID(SERVER._coop(), ROLES[roleCode].id);
    }

    static _getCodes(roleCodes = []) {
        let roles = [];
        const guild = SERVER._coop();

        roleCodes.map(code => {
            const roleConfig = ROLES[code] || null;
            if (roleConfig) {
                const roleID = roleConfig.id || null;
                if (!roleID) {
                    const role = this.getRoleByID(guild, roleID);
                    if (role) roles.push(role);
                }
            }

        });
        return roles;
    }

    static _add(userID, roleCode) {
        try {
            const guild = SERVER._coop();
            const role = this.getRoleByID(guild, ROLES[roleCode].id);
            const member = COOP.USERS._getMemberByID(userID);

            if (role && member) return member.roles.add(role);
            else {
                // Should throw error?
                return false;
            }
        } catch(e) {
            console.log('Error adding role');
            console.error(e);
        }
    }

    static _addManyToMember(member, roleCodes) {
        return member.roles.add(COOP.ROLES._getCodes(roleCodes));
    }

    static async toggle(userID, roleCode) {
        try {
            const member = COOP.USERS._getMemberByID(userID);

            // TODO: Track roles self-changed as statistic.
            if (!member) return false;
            if (!Object.keys(ROLES).includes(roleCode)) return false;
    
            // Check if user has it or not.
            const hasRoleAlready = COOP.USERS.hasRoleID(member, ROLES[roleCode].id);
            if (!hasRoleAlready) await this._add(userID, roleCode);
            else await this._remove(userID, roleCode);
            return true;

        } catch(e) {
            console.log('Error with toggle role ' + roleCode);
            console.error(e);
        }
    }

    static async _remove(userID, roleCode) {
        try {
            const guild = SERVER._coop();
            const role = this.getRoleByID(guild, ROLES[roleCode].id);
            const user = COOP.USERS._getMemberByID(userID);
            if (role && user) return await user.roles.remove(role);
        } catch(e) {
            console.log('Error removing role');
            console.error(e);
        }
        // 723676356818239773 LEADER
    }

    static _has(member, roleCode) {
        const roleID = ROLES[roleCode].id;
        return member.roles.cache.has(roleID);
    }

    static _getUsersWithRoleCodes(roleCodes) {
        const guild = SERVER._coop();
        return guild.members.cache.filter(member => {
            let match = false;

            // Test if they have any role codes.
            roleCodes.forEach(roleCode => {
                const roleID = ROLES[roleCode].id;
                if (member.roles.cache.has(roleID)) match = true;
            });

            return match;
        });
    }

    static _getUserWithCode(code) {
        let user = null;

        const guild = SERVER._coop();
        const roleID = ROLES[code].id || null;

        const filterUsers = guild.members.cache.filter(member => member.roles.cache.has(roleID));
        if (filterUsers.size > 0) user = filterUsers.first();

        return user;
    }
}