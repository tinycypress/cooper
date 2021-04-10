import moment from 'moment';
import _ from 'lodash';

import Chicken from "../../../chicken";


import CHANNELS from '../../../../origin/config/channels.json';

import COOP from '../../../../origin/coop';


import DatabaseHelper from '../../../databaseHelper';
import Database from '../../../../origin/setup/database';
import VotingHelper from '../../../activity/redemption/votingHelper';
import EventsHelper from '../../../eventsHelper';

import { baseTickDur } from '../../../manifest';




export default class ElectionHelper {

    // Duration of election voting
    static VOTING_DUR_SECS = (3600 * 24) * 7;

    // Allow for a week of voting before reset.
    static TERM_DUR_SECS = ((3600 * 24) * 30) + this.VOTING_DUR_SECS;

    static async addVote(userID, candidateID) {
        const query = {
            name: "add-vote",
            text: `INSERT INTO election_votes(candidate_id, voter_id, time)
                VALUES($1, $2, $3)`,
            values: [candidateID, userID, (parseInt(Date.now() / 1000))]
        };
        
        const result = await Database.query(query);
        return result;
    }
    
    static async clearVotes() {
        const query = {
            name: "delete-votes",
            text: `DELETE FROM election_votes`
        };
        
        const result = await Database.query(query);
        return result;
    }

    static async clearElection() {
        // vv same as below but for votes.
        await this.clearVotes();
        await this.clearCandidates();
    }



    static async clearCandidates() {
        const candidates = await this.getAllCandidates();
        
        // Bulk delete may be better here.
        // Ensure all messages deleted, use bulk delete won't be outside of 14 days

        // TODO: Could create as temp messages so this is unnecessary?
        // Or offer as double feature.

        candidates.map((candidate, index) => {
            setTimeout(() =>
                COOP.MESSAGESdeleteByLink(candidate.campaign_msg_link), 
                1500 * index
            );
        });

        // Clear database
        const query = {
            name: "delete-candidates",
            text: `DELETE FROM candidates`
        };
        const result = await Database.query(query);
        return result;
    }

    static async votingPeriodLeftSecs() {
        let leftSecs = 0;

        const isVotingPeriod = await this.isVotingPeriod();
        if (isVotingPeriod) {
            const endOfVoting = (await this.lastElecSecs()) + this.VOTING_DUR_SECS;
            const diff = endOfVoting - parseInt(Date.now() / 1000);
            if (diff > 0) leftSecs = diff;
        }

        return leftSecs;
    }
    
    // Calculate if current moment in seconds is a voting period.
    static async isVotingPeriod() {
        // Declare the variable for voting period calculation.
        let isVotingOn = false;

        try {
            // Calculate current seconds.
            const nowSecs = parseInt(Date.now() / 1000);

            // Load election data required for calculating election start.
            const isElectionOn = await this.isElectionOn();
            const lastElectionSecs = await this.lastElecSecs();

            // Check if current moment is earlier than the end of voting.
            if (isElectionOn && nowSecs < lastElectionSecs + this.VOTING_DUR_SECS)
                isVotingOn = true;
                
            // If election isn't running, check if next election period due.
            if (!isElectionOn && nowSecs > lastElectionSecs + this.TERM_DUR_SECS) 
                isVotingOn = true;

            // Provide calculation for whether current moment in seconds is a voting period.
            return isVotingOn;

        } catch(e) {
            console.log('Voting period check failure.')
            console.error(e);

            // Don't start any elections if this is throwing errors, lol.
            return false;
        }
    }

    // Setup the intervals needed for detection.
    static setupIntervals() {
        // Processes announcements and election events.
        EventsHelper.runInterval(() => this.checkProgress(), baseTickDur);

        // Ensure leadership and commander based on items so they are treated seriously.
        EventsHelper.runInterval(() => this.ensureItemSeriousness(), baseTickDur * 6);
    }


    static async startElection() {
        try {
            // Turn election on and set latest election to now! :D
            await Chicken.setConfig('election_on', 'true');
            await Chicken.setConfig('last_election', parseInt(Date.now() / 1000));
            
            // Update the election message
            const readableElecLeft = COOP.TIME.humaniseSecs((await this.votingPeriodLeftSecs()));
            const startElecText = `The election is currently ongoing! Time remaining: ${readableElecLeft}`;
            await this.editElectionInfoMsg(startElecText);

            // Inform all members so they can fairly stand.
            const feedMsg = await COOP.CHANNELS_postToFeed(
                `@everyone, our latest ${COOP.CHANNELScodeText('ELECTION')} is running, all members are welcome to stand or vote for their preferred commander and leaders. \n` +
                `For further information on our elections refer to our forth amendment in ${COOP.CHANNELScodeText('CONSTITUTION')}\n\n` +
                `To stand for election, send in any channel this message: \n\n !stand ((and your campaign message here, brackets - () - not needed)) \n\n` +
                `Time remaining: ${readableElecLeft}.`
            );

            // React crown to this message.
            COOP.MESSAGESdelayReact(feedMsg, '👑', 666);

        } catch(e) {
            console.log('Starting the election failed... :\'(');
            console.error(e);
        }
    }

    static getMaxNumLeaders() {
        return VotingHelper.getNumRequired(COOP.SERVER._coop(), .025);
    }

    // Provide updates and functionality for an ongoing election.
    static async commentateElectionProgress() {
        // Check time since last election commentation message (prevent spam).
        const lastElecMsgSecs = parseInt(await Chicken.getConfigVal('last_elecupdatemsg_secs'));
        const nowSecs = COOP.TIME._secs();
        const diff = nowSecs - lastElecMsgSecs;
        const hourSecs = 3600;

        // Defaul to a 3 hourSecs gap between election messages.
        let bufferSecs = (hourSecs * 6);

        // If election end approaching use quicker interval:
        if (diff < hourSecs * 10)
        // (within 10 hourSecss should count every 2 hourSecss)
            bufferSecs = hourSecs * 2;
        else if (diff < hourSecs * 8)
            // (within 8 hourSecss should count every 1 hourSecss)
            bufferSecs = hourSecs * 1;
        else if (diff < hourSecs * 4)
            // (within 4 hourSecss should count every 0.5 hourSecss)
            bufferSecs = hourSecs * 0.5;
        
        const fresh = nowSecs < lastElecMsgSecs + bufferSecs;
        if (fresh) return false;

        // Note: Votes aren't saved in the database... we rely solely on Discord counts.
        const votes = await this.fetchAllVotes();

        const votingPeriodSecs = await this.votingPeriodLeftSecs();
        const readableElecLeft = COOP.TIME.humaniseSecs(votingPeriodSecs);

        const hierarchy = this.calcHierarchy(votes);
        const maxNumLeaders = this.getMaxNumLeaders();
        const numLeaders = hierarchy.leaders.length;

        const electionProgressText = `**Election is still running for ${readableElecLeft}, latest vote results:**` +
            `\n\n` +
            `**Commander:** ${hierarchy.commander ? 
                `${hierarchy.commander.username} (${hierarchy.commander.votes} Votes)` : ''}` +
            `\n\n` +
            `**Leaders ${numLeaders}/${maxNumLeaders}:**\n${
                hierarchy.leaders
                    .map(leader => `${leader.username} (${leader.votes} Votes)`)
                    .join('\n')
            }` +
            `\n\n`;
        
        // Ensure Cooper knows when the last time this was updated (sent).
        Chicken.setConfig('last_elecupdatemsg_secs', COOP.TIME._secs());

        // Inform the community and update records.
        await this.editElectionInfoMsg(electionProgressText);
        COOP.CHANNELS_codes(['FEED', 'TALK', 'ACTIONS'], electionProgressText);
    }

    static async endElection() {
        try {
            const votes = await this.fetchAllVotes();
            const hierarchy = this.calcHierarchy(votes);
           
            // Remove roles from previous hierarchy.
            await this.resetHierarchyRoles();

            // Add roles to winners.
            COOP.ROLESadd(hierarchy.commander.id, 'COMMANDER');
            Promise.all(hierarchy.leaders.map(async (leader, index) => {
                await new Promise(r => setTimeout(r, 333 * index));
                await COOP.ROLESadd(leader.id, 'LEADER');
                return true;
            }));

            // Cleanup database records fresh for next run.
            await this.clearElection();

            // Set Cooper's config election_on to 'false' so he does not think election is ongoing.
            await Chicken.setConfig('election_on', 'false');

            const nextElecFmt = await this.nextElecFmt();

            // Announce the winners!
            const declareText = `**Latest <#${CHANNELS.ELECTION.id}> ends with these results!**\n\n` +

                `**New Commander:**\n${hierarchy.commander.username}\n\n` +

                `**New Leaders:** \n` +
                    `${hierarchy.leaders.map(leader => `${leader.username} (${leader.votes} Votes)`).join('\n')}\n\n` +

                `**Next Election:** ${nextElecFmt}.`;
            
            COOP.CHANNELS_postToFeed(declareText);
            await this.editElectionInfoMsg(declareText);

            // Handle election items.
            await this.resetHierarchyItems();

            // Add the election items.
            COOP.ITEMS.add(hierarchy.commander.id, 'ELECTION_CROWN', 1);
            hierarchy.leaders.map(leader => COOP.ITEMS.add(leader.id, 'LEADERS_SWORD', 1));

        } catch(e) {
            console.log('Something went wrong ending the election...');
            console.error(e);
        }
    }

    static async resetHierarchyRoles() {
        try {
            const exCommander = COOP.ROLESgetUsersWithRoleCodes(['COMMANDER']).first();
            const exLeaders = COOP.ROLESgetUsersWithRoleCodes(['LEADER']);
            
            // Remove the former leader roles.
            let index = 0;
            await Promise.all(exLeaders.map(async (exLeader) => {
                index++;
                await new Promise(r => setTimeout(r, 777 * index));
                await COOP.ROLESremove(exLeader.user.id, 'LEADER');
                return true;
            }));

            // Remove the former commander role.
            await COOP.ROLESremove(exCommander.user.id, 'COMMANDER');
    
            // Add former commander to ex commander!
            if (!COOP.ROLEShas(exCommander, 'FORMER_COMMANDER')) {
                COOP.CHANNELS_postToFeed(`${exCommander.user.username} is recognised as a former commander and allowed access into the former commanders' secret channel!`);
                await COOP.ROLESadd(exCommander.user.id, 'FORMER_COMMANDER');

                // Update last served data for the former commander.
                // last_served
            }
    
            return true;

        } catch(e) {
            console.log('Error resetting hierarchy roles.');
            console.error(e);
        }
    }

    static async resetHierarchyItems() {
        try {
            // Load hierarchy of users (role-based hierarchy).
            const leaderItems = await COOP.ITEMS.getUsersWithItem('LEADERS_SWORD');
            const commanderItems = await COOP.ITEMS.getUsersWithItem('ELECTION_CROWN');        

            // Remove all of the sworsd from the old leaders.
            leaderItems.map(exLeader => 
                COOP.ITEMS.subtract(exLeader.owner_id, 'LEADERS_SWORD'));

            // Remove the commander crown item from the (now) ex commander.
            if (commanderItems) 
                COOP.ITEMS.subtract(commanderItems[0].owner_id, 'ELECTION_CROWN', 1);

        } catch(e) {
            console.log('Error reseting hierarchy items');
            console.error(e);
        }
    }

    static async ensureItemSeriousness() {
        try {
            // Load hierarchy on basis of items.
            const leaderItems = await COOP.ITEMS.getUsersWithItem('LEADERS_SWORD');
            const commanderItem = await COOP.ITEMS.getUserWithItem('ELECTION_CROWN');
            const swordOwners = leaderItems.map(item => item.owner_id);

            // Load users by roles for comparison/checking.
            const roleHierarchy = this._roleHierarchy();
            
            // Any leader who has role but not leaders_sword -> role removed.
            roleHierarchy.leaders.map(leader => {
                // Check each role item for existence in leader items ownership data.
                if (!swordOwners.includes(leader.user.id) && COOP.ROLEShas(leader, 'LEADER'))
                    COOP.ROLESremove(leader.user.id, 'LEADER');
            });
            
            // Any commander who has role but not election_crown -> role removed.
            if (roleHierarchy.commander) {
                const isUsurper = commanderItem.owner_id !== roleHierarchy.commander.user.id;
                if (isUsurper && COOP.ROLEShas(roleHierarchy.commander, 'COMMANDER'))
                    COOP.ROLESremove(roleHierarchy.commander.user.id, 'COMMANDER');
            }
        
            // Get leaders by loading members via IDs
            const rightfulLeaders = COOP.USERS._filter(user => swordOwners.includes(user.id));

            // Any leader who has leaders_sword but not role -> leaders_sword added.
            rightfulLeaders.map(leader => {
                if (!COOP.ROLEShas(leader, 'LEADER'))
                    COOP.ROLESadd(leader.user.id, 'LEADER');
            });

            // Any commander who has election_crown but not role -> election_crown added.
            const rightfulCommander = COOP.USERS._get(commanderItem.owner_id);
            if (!COOP.ROLEShas(rightfulCommander, 'COMMANDER'))
                COOP.ROLESadd(rightfulCommander.user.id, 'COMMANDER');

        } catch(e) {
            console.log('Error ensuring item seriousness.');
            console.error(e);
        }
    }



    static async checkProgress() {
        // A variable used for tracking election before/after (start).
        let electionStarted = false;
        
        try {
            // Load the current state of election from database.
            const isElecOn = await this.isElectionOn();
            const isVotingPeriod = await this.isVotingPeriod();

            // Election needs to be started?
            if (isVotingPeriod && !isElecOn) {
                await this.startElection();
                electionStarted = true;
            }
            
            // Code to only run until after the first time after election start, not before.
            if (!electionStarted) {

                // Commentate election and detect conclusion of.
                if (isElecOn) {
                    // Election needs to be declared?
                    if (!isVotingPeriod && isElecOn) await this.endElection();
            
                    // Election needs to announce update?
                    if (isVotingPeriod && isElecOn) await this.commentateElectionProgress();
                }
                
                // If election isn't running (sometimes) update about next election secs.
                if (!isElecOn) await this.countdownFeedback();
            }

        } catch(e) {
            console.log('SOMETHING WENT WRONG WITH CHECKING ELECTION!');
            console.error(e);
        }
    }

    static async getElectionMsg() {
        const electionInfoMsgLink = await Chicken.getConfigVal('election_message_link');
        const msgData = COOP.MESSAGESparselink(electionInfoMsgLink);   
        const channel = COOP.CHANNELS_get(msgData.channel);
        const msg = await channel.messages.fetch(msgData.message);
        return msg;
    }

    static async editElectionInfoMsg(text) {
        const msg = await this.getElectionMsg();
        const editedMsg = await msg.edit(text);
        return editedMsg;
    }

    static async getVoteByVoterID(voterID) {
        const query = {
            name: "get-voter",
            text: `SELECT * FROM election_votes WHERE voter_id = $1`,
            values: [voterID]
        };
        
        const result = await Database.query(query);
        const voter = DatabaseHelper.single(result);

        return voter;
    }

    // Check if this reaction applies to elections.
    static async onReaction(reaction, user) {
        // Check if occurred in election channel
        if (reaction.message.channel.id !== CHANNELS.ELECTION.id) return false;

        // Ignore Cooper's prompt emoji.
        if (COOP.USERS.isCooper(user.id)) return false;

        // Check if reaction is crown (indicates vote)
        if (reaction.emoji.name !== '👑') return false;

        try {
            // Check if reaction message is a campaign message and get author.
            const msgLink = COOP.MESSAGESlink(reaction.message);
            const candidate = await this.getCandByMsgLink(msgLink); 

            // If is candidate message and identified, allow them the vote.
            if (candidate) {
                // Check if already voted
                const vote = await this.getVoteByVoterID(user.id);
                const candidateUser = (await COOP.USERS._getMemberByID(candidate.candidate_id)).user;

                // Add vote to database
                await this.addVote(user.id, candidate.candidate_id);
                
                // Disabled vote limits, but use it to prevent feedback spam.
                if (!vote) {
                    // Announce and update.
                    await this.commentateElectionProgress();
            
                    // Acknowledge vote in feed.
                    COOP.CHANNELS_postToFeed(`${user.username} cast their vote for ${candidateUser.username}!`);
                }
            }
        } catch(e) {
            console.log('Could not process election vote.');
            console.error(e);
        }
    }

    static async countVotes() {
        const query = {
            name: "get-candidate",
            text: `SELECT candidateID, COUNT(*) FROM votes GROUP BY candidateID`,
            values: [userID]
        };

        const result = await Database.query(query);
        return result;
    }

    static calcHierarchy(votes) {
        const commander = votes[0];
        const numLeaders = this.getMaxNumLeaders();
        const leaders = votes.slice(1, numLeaders + 1);

        const hierarchy = { commander, leaders, numLeaders };

        return hierarchy;
    }

    static async loadAllCampaigns() {
        const candidates = await this.getAllCandidates();
        const preloadMsgIDs = candidates.map(candidate => 
            COOP.MESSAGESparselink(candidate.campaign_msg_link)
        );

        // Preload each candidate message.
        let campaigns = await Promise.allSettled(preloadMsgIDs.map((idSet, index) => {
            const guild = COOP.SERVER._coop();
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        // This could be more efficient.
                        const chan = guild.channels.cache.get(idSet.channel);
                        if (chan) {
                            const msg = await chan.messages.fetch(idSet.message);
                            if (msg) resolve(msg);
                        }
                    } catch(e) {
                        console.log(idSet);
                        console.log('Error loading campaign message')
                    }
                }, 666 * index);
            });
        }));

        // take only the fulfilled ones, let the rest keep failing until they're cleaned up.
        campaigns = campaigns
            .filter(campaign => campaign.status === 'fulfilled')
            .map(campaign => campaign.value);

        return campaigns;
    }

    static async getCandByMsgLink(msgLink) {
        const query = {
            name: "get-candidate-by-msg",
            text: `SELECT * FROM candidates WHERE campaign_msg_link = $1`,
            values: [msgLink]
        };

        return await DatabaseHelper.singleQuery(query);
    }

    // TODO: could use this feature/data to direct message the candidates an update
    static async fetchAllVotes() {
        const votes = [];

        // Calculate votes and map author data.
        const campaignMsgs = await this.loadAllCampaigns();
        campaignMsgs.map(campaignMsg => {
            // Find the candidate for these reactions.
            let candidate = null;
            const embed = campaignMsg.embeds[0] || null;
            if (embed) {
                const idMatches = embed.description.match(/\<@(\d+)\>/gms);
                let embedUserID = idMatches[0];
                embedUserID = embedUserID.replace('<@', '');
                embedUserID = embedUserID.replace('>', '');
                if (embedUserID) candidate = COOP.USERS._getMemberByID(embedUserID).user;
            }

            // Add to the overall data.
            if (candidate) {
                votes.push({
                    username: candidate.username,
                    id: candidate.id,
                    votes: campaignMsg.reactions.cache.reduce((acc, reaction) => {
                        // Count all crown reactions.
                        if (reaction.emoji.name === '👑') return acc += (reaction.count - 1);
                        else return 0;
                    }, 0)
                });
            }
        });
        
        // Sort votes by most voted for candidate.
        votes.sort((a, b) => {
            if (a.votes < b.votes) return 1;
            if (a.votes > b.votes) return -1;
            return 0;
        });

        return votes;
    }

    static async getCandidate(userID) {
        const query = {
            name: "get-candidate",
            text: `SELECT * FROM candidates WHERE candidate_id = $1`,
            values: [userID]
        };
        
        const candidate = await DatabaseHelper.singleQuery(query);

        return candidate;
    }


    // Preload campaign messages into cache so they are always reactable.
    static async onLoad() {
        const isElectionOn = await this.isVotingPeriod();
        if (isElectionOn) {
            await this.loadAllCampaigns();
            console.warn('Cached election candidates.');
        }
    }

    static async addCandidate(userID, msgLink) {
        const query = {
            name: "add-candidate",
            text: `INSERT INTO candidates(campaign_msg_link, candidate_id)
                VALUES($1, $2)`,
            values: [msgLink, userID]
        };
        
        const result = await Database.query(query);
        return result;
    }

    static async getAllCandidates() {
        const query = {
            name: "get-all-candidates",
            text: `SELECT * FROM candidates`
        };
        
        let candidates = null;
        const result = await Database.query(query);
        if (result.rows) candidates = result.rows;

        return candidates;
    }


    static async lastElecSecs() {
        const lastElecSecsVal = await Chicken.getConfigVal('last_election');
        const lastElecSecs = parseInt(lastElecSecsVal);
        return lastElecSecs;        
    }

    static async lastElecFmt() {
        const lastElecSecs = await this.lastElecSecs();
        const lastElecMoment = moment.unix(lastElecSecs);
        return lastElecMoment.format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

    static async nextElecFmt() {
        const nextElecSecs = await this.nextElecSecs();
        const nextElecMoment = moment.unix(nextElecSecs);
        
        return nextElecMoment.format('dddd, MMMM Do YYYY, h:mm:ss a');
    }

    static async nextElecSecs() {
        const lastElecSecs = await this.lastElecSecs();
        const nextElecSecs = lastElecSecs + this.TERM_DUR_SECS;
        return nextElecSecs;
    }

    // This is only active from next election interval moment to a week after that
    static async isElectionOn() {
        const electionOnVal = await Chicken.getConfigVal('election_on');
        return electionOnVal === 'true';
    }

    static async isElectionTime() {
        const lastElecSecs = await this.lastElecSecs();
        const nextElecSecs = await this.nextElecSecs();
        const nextDeclareSecs = lastElecSecs + this.TERM_DUR_SECS + this.VOTING_DUR_SECS;

        const nowSecs = parseInt(Date.now() / 1000);

        if (nowSecs >= nextElecSecs && nowSecs <= nextDeclareSecs) return true;

        return false;
    }

    static _roleHierarchy() {
        const hierarchy = {
            commander: COOP.ROLESgetUserWithCode('COMMANDER'),
            leaders: COOP.ROLESgetUsersWithRoleCodes(['LEADER'])
        };
        return hierarchy;
    }

    static async humanRemainingNext() {
        const diff = await this.nextElecSecs() - parseInt(Date.now() / 1000)
        const humanRemaining = COOP.TIME.humaniseSecs(diff);
        return humanRemaining;
    }

    static async countdownFeedback() {
        const elecMsg = await this.getElectionMsg();
        const diff = parseInt(Date.now()) - elecMsg.editedTimestamp;
        const hour = 3600;

        if (diff > hour * 4) {
            const humanRemaining = await this.humanRemainingNext();
            const nextElecReadable = await this.nextElecFmt();

            const hierarchy = this._roleHierarchy();

            await this.editElectionInfoMsg(
                `**Election is over, here are your current officials:** \n\n` +

                `**Commander:**\n${hierarchy.commander.user.username} :crown: \n\n` +

                `**Leaders:**\n` +
                    `${hierarchy.leaders.map(leader => `${leader.user.username} :crossed_swords:`).join('\n')}\n\n` +

                `**Next Election:** ${nextElecReadable} (${humanRemaining})`
            );
        }

        // TODO: Post the occassional reminder too...
    }

}