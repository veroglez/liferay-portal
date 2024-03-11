/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getRandomString from '../../../utils/getRandomString';

export default function getGridDefinition(id: string): PageElement {
	const columnId = getRandomString();

	return {
		definition: {
			gutters: true,
			numberOfColumns: 3,
		},
		id,
		pageElements: [
			{
				definition: {
					size: 12,
				},
				id: columnId,
				type: 'Column',
			},
		],
		type: 'Row',
	};
}
