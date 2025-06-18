export function getModActionLabel(modAction: string): string {
    return modActions[modAction]?.label ?? modAction
}

export function getModActionColor(modAction: string): string {
    return modActions[modAction]?.color ?? '#DDDDDD'
}

export function getModActionsForCategory(category: Category): string[] {
    return Object.entries(modActions)
        // entry[1] == value
        .filter((entry) => entry[1].category === category)
        // entry[0] == key
        .map((entry) => entry[0])
}

export function getModActions(): string[] {
    return Object.keys(modActions)
}

export function getModActionCategories(): Category[] {
    return Object.values(categoryValues)
}

export function getCategoryLabel(category:Category): string {
    return categoryLabels[category] ?? category
}

const categoryValues = [
    'GENERAL',
    'POST_OR_COMMENT',
    'POST',
    'COMMENT',
    'USER',
    'SUBREDDIT',
    'MODERATOR',
    'WIKI',
] as const;

export type Category = typeof categoryValues[number];

const modActions: Record<string, { label: string; color: string; category: Category }> = {
    acceptmoderatorinvite: {label: 'accepted moderator invite', color: '#3366CC', category: 'MODERATOR'},
    addcontributor: {label: 'added a contributor', color: '#DC3912', category: 'MODERATOR'},
    addremovalreason: {label: 'added a removal reason', color: '#FF9900', category: 'POST_OR_COMMENT'},
    approvecomment: {label: 'approved a comment', color: '#109618', category: 'COMMENT'},
    approvelink: {label: 'approved a post', color: '#990099', category: 'POST'},
    banuser: {label: 'banned user', color: '#0099C6', category: 'USER'},
    community_welcome_page: {label: 'edited the community welcome page', color: '#DD4477', category: 'SUBREDDIT'},
    community_widgets: {label: 'edited the community widgets', color: '#66AA00', category: 'SUBREDDIT'},
    distinguish: {label: 'distinguished a post or comment', color: '#B82E2E', category: 'POST_OR_COMMENT'},
    editflair: {label: 'edited post flair', color: '#316395', category: 'MODERATOR'},
    editsettings: {label: 'changed community settings', color: '#994499', category: 'SUBREDDIT'},
    ignorereports: {label: 'ignored reports', color: '#22AA99', category: 'POST_OR_COMMENT'},
    invitemoderator: {label: 'invited a moderator', color: '#AAAA11', category: 'MODERATOR'},
    lock: {label: 'locked a post or comment', color: '#6633CC', category: 'POST_OR_COMMENT'},
    marknsfw: {label: 'marked as nsfw', color: '#E67300', category: 'POST'},
    muteuser: {label: 'muted a user', color: '#8B0707', category: 'USER'},
    removecomment: {label: 'removed a comment', color: '#329262', category: 'COMMENT'},
    removelink: {label: 'removed a post', color: '#CD486B', category: 'POST'},
    spamcomment: {label: 'marked a comment as spam', color: '#FF5722', category: 'COMMENT'},
    spamlink: {label: 'marked a post as spam', color: '#607D8B', category: 'POST'},
    sticky: {label: 'stickied a post', color: '#9C27B0', category: 'POST'},
    submit_scheduled_post: {label: 'submitted a scheduled post', color: '#3F51B5', category: 'SUBREDDIT'},
    unbanuser: {label: 'unbanned a user', color: '#00BCD4', category: 'USER'},
    unlock: {label: 'unlocked a post or comment', color: '#4CAF50', category: 'POST_OR_COMMENT'},
    unsticky: {label: 'unstickied a post', color: '#795548', category: 'POST'},
    wikipagelisted: {label: 'listed a wiki page', color: '#FFC107', category: 'WIKI'},
    wikirevise: {label: 'revised a wiki page', color: '#8BC34A', category: 'WIKI'},
};

export const modlogDetails: Record<string, string>  = {
    confirm_ham: 'Not spam',
    unspam: 'Not spam',
    remove: 'Remove',
    flair_edit: 'Edit flair',
    confirm_spam: 'Confirm spam',
    replaced: 'Replaced',
    edit_widget: 'Edit widget',
    removed_widget: 'Remove widget',
    public_description: 'Public description',
    flair_add: 'Add flair',
    flair_template: 'Template flair',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: '',
    11: '',
}

const categoryLabels: Record<Category,string> = {
    'GENERAL': 'General',
    'POST_OR_COMMENT': 'Post&Comment',
    'POST': 'Post',
    'COMMENT': 'Comment',
    'USER': 'User',
    'SUBREDDIT': 'Subreddit',
    'MODERATOR': 'Moderator',
    'WIKI': 'Wiki',
}