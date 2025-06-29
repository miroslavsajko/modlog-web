export function getModActionLabel(modAction: string): string {
    return modActions[modAction]?.label ?? modAction
}

export function getModActionChartColor(modAction: string): string {
    return modActions[modAction]?.chartColor ?? '#DDDDDD'
}

export function getModActionsForGroup(group: ActionGroup): string[] {
    return Object.entries(modActions)
        // entry[1] == value
        .filter((entry) => entry[1].group === group)
        // entry[0] == key
        .map((entry) => entry[0])
}

export function getModActions(): string[] {
    return Object.keys(modActions)
}

export function getModActionGroups(): ActionGroup[] {
    return Object.values(groups)
}

export function getActionGroupLabel(group: ActionGroup): string {
    return groupLabels[group] ?? group
}

export function getActionGroupForModAction(modAction: string): ActionGroup | undefined {
    return modActions[modAction]?.group
}

export function getModActionCategoryColor(modAction: string): string {
    return categoryColors[modActions[modAction]?.category] ?? 'grey'
}

export function getModActionDetailLabel(modActionDetail: string, modActionDescription: string): string | null {
    if (modActionDescription?.length > 0) return modActionDescription
    const resolvedModlogDetail = modlogDetails[modActionDetail];
    if (resolvedModlogDetail?.length > 0) return resolvedModlogDetail
    return null
}

const groups = [
    'GENERAL',
    'POST_OR_COMMENT',
    'POST',
    'COMMENT',
    'USER',
    'SUBREDDIT',
    'MODERATOR',
    'WIKI',
] as const;

export type ActionGroup = typeof groups[number];

export type Category = 'APPROVAL' | 'REMOVAL' | 'BAN' | 'UNBAN' | 'SUBREDDIT_META' | 'NEUTRAL';

const modActions: Record<string, { label: string; chartColor: string; group: ActionGroup; category: Category }> = {
    acceptmoderatorinvite: {
        label: 'accepted moderator invite',
        chartColor: '#3366CC',
        group: 'MODERATOR',
        category: "SUBREDDIT_META"
    },
    addcontributor: {
        label: 'added a contributor',
        chartColor: '#DC3912',
        group: 'MODERATOR',
        category: "SUBREDDIT_META"
    },
    addremovalreason: {
        label: 'added a removal reason',
        chartColor: '#FF9900',
        group: 'POST_OR_COMMENT',
        category: "REMOVAL"
    },
    approvecomment: {label: 'approved a comment', chartColor: '#109618', group: 'COMMENT', category: "APPROVAL"},
    approvelink: {label: 'approved a post', chartColor: '#990099', group: 'POST', category: "APPROVAL"},
    banuser: {label: 'banned user', chartColor: '#0099C6', group: 'USER', category: "BAN"},
    community_welcome_page: {
        label: 'edited the community welcome page',
        chartColor: '#DD4477',
        group: 'SUBREDDIT',
        category: "SUBREDDIT_META"
    },
    community_widgets: {
        label: 'edited the community widgets',
        chartColor: '#66AA00',
        group: 'SUBREDDIT',
        category: "SUBREDDIT_META"
    },
    create_scheduled_post: {
        label: 'created a scheduled post',
        chartColor: '#442E77',
        group: 'SUBREDDIT',
        category: "SUBREDDIT_META"
    },
    distinguish: {
        label: 'distinguished a post or comment',
        chartColor: '#B82E2E',
        group: 'POST_OR_COMMENT',
        category: "NEUTRAL"
    },
    editflair: {label: 'edited post flair', chartColor: '#316395', group: 'POST', category: "APPROVAL"},
    editsettings: {
        label: 'changed community settings',
        chartColor: '#994499',
        group: 'SUBREDDIT',
        category: "APPROVAL"
    },
    ignorereports: {label: 'ignored reports', chartColor: '#22AA99', group: 'POST_OR_COMMENT', category: "NEUTRAL"},
    invitemoderator: {
        label: 'invited a moderator',
        chartColor: '#AAAA11',
        group: 'MODERATOR',
        category: "SUBREDDIT_META"
    },
    lock: {label: 'locked a post or comment', chartColor: '#6633CC', group: 'POST_OR_COMMENT', category: "REMOVAL"},
    marknsfw: {label: 'marked as nsfw', chartColor: '#E67300', group: 'POST', category: "NEUTRAL"},
    muteuser: {label: 'muted a user', chartColor: '#8B0707', group: 'USER', category: "REMOVAL"},
    removecomment: {label: 'removed a comment', chartColor: '#329262', group: 'COMMENT', category: "REMOVAL"},
    removelink: {label: 'removed a post', chartColor: '#CD486B', group: 'POST', category: "REMOVAL"},
    spamcomment: {label: 'marked a comment as spam', chartColor: '#FF5722', group: 'COMMENT', category: "REMOVAL"},
    spamlink: {label: 'marked a post as spam', chartColor: '#607D8B', group: 'POST', category: "REMOVAL"},
    sticky: {label: 'stickied a post', chartColor: '#9C27B0', group: 'POST', category: "NEUTRAL"},
    submit_scheduled_post: {
        label: 'submitted a scheduled post',
        chartColor: '#3F51B5',
        group: 'SUBREDDIT',
        category: "NEUTRAL"
    },
    unbanuser: {label: 'unbanned a user', chartColor: '#00BCD4', group: 'USER', category: "UNBAN"},
    unlock: {
        label: 'unlocked a post or comment',
        chartColor: '#4CAF50',
        group: 'POST_OR_COMMENT',
        category: "APPROVAL"
    },
    unsticky: {label: 'unstickied a post', chartColor: '#795548', group: 'POST', category: "NEUTRAL"},
    wikipagelisted: {label: 'listed a wiki page', chartColor: '#FFC107', group: 'WIKI', category: "SUBREDDIT_META"},
    wikirevise: {label: 'revised a wiki page', chartColor: '#8BC34A', group: 'WIKI', category: "SUBREDDIT_META"},
};

const modlogDetails: Record<string, string> = {
    // confirm_ham: 'Not spam',
    unspam: 'Not spam',
    // remove: '', // 'Remove',
    // flair_edit: 'Edit flair',
    confirm_spam: 'Confirm spam',
    // replaced: 'Replaced',
    edit_widget: 'Edit widget',
    removed_widget: 'Remove widget',
    public_description: 'Public description',
    flair_add: 'Add flair',
    flair_template: 'Template flair',
    // 1: '',
    // 2: '',
    // 3: '',
    // 4: '',
    // 5: '',
    // 6: '',
    // 7: '',
    // 8: '',
    // 9: '',
    // 10: '',
    // 11: '',
}

const groupLabels: Record<ActionGroup, string> = {
    'GENERAL': 'General',
    'POST_OR_COMMENT': 'Post&Comment',
    'POST': 'Post',
    'COMMENT': 'Comment',
    'USER': 'User',
    'SUBREDDIT': 'Subreddit',
    'MODERATOR': 'Moderator',
    'WIKI': 'Wiki',
}

const categoryColors: Record<Category, string> = {
    'APPROVAL': 'darkgreen',
    'REMOVAL': 'darkred',
    'BAN': 'darkred',
    'UNBAN': 'darkgreen',
    'SUBREDDIT_META': 'goldenrod',
    'NEUTRAL': 'darkgrey'
}