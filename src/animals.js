const ANIMALS = [
	'🐀',
	'🐁',
	'🐂',
	// '🐃',
	'🐄',
	'🐅',
	'🐆',
	'🐇',
	'🐈',
	'🐉',
	'🐊',
	// '🐋',
	'🐌',
	'🐍',
	'🐎',
	'🐏',
	'🐐',
	'🐑',
	'🐒',
	'🐓',
	'🐔',
	'🐕',
	'🐖',
	'🐗',
	'🐘',
	// '🐙',
	// '🐚',
	'🐛',
	// '🐜',
	'🐝',
	'🐞',
	// '🐟',
	// '🐠',
	// '🐡',
	'🐢',
	// '🐣',
	'🐤',
	'🐥',
	'🐦',
	// '🐧',
	'🐨',
	'🐩',
	'🐪',
	'🐫',
	// '🐬',
	'🐭',
	'🐮',
	'🐯',
	'🐰',
	'🐱',
	'🐲',
	// '🐳',
	'🐴',
	'🐵',
	'🐶',
	'🐷',
	'🐸',
	'🐹',
	'🐺',
	'🐻',
	'🐼',
	// '🐽',
	// '🐾',
	'🐿',
	// '👽',
	// '👾',
	// '💐',
	'🕊',
	// '🕷',
	// '🕸',
	// '😸',
	// '😹',
	'😺',
	// '😻',
	// '😼',
	// '😽',
	// '😾',
	// '😿',
	// '🙀',
]
module.exports = function() {
	return ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
}
