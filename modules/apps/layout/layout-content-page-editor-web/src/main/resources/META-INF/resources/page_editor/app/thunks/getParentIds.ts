/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {LayoutData} from '../../types/layout_data/LayoutData';

export default function getParentIds(
	itemIds: string[],
	layoutData: LayoutData
) {
	const {items: layoutDataItems} = layoutData;
	const itemIdsToRemoveFromSelected: string[] = [];

	const hasParentSelected = (itemId: string) => {
		const parentId = layoutDataItems[itemId].parentId;

		if (!parentId) {
			return false;
		}

		if (itemIds.includes(parentId)) {
			return true;
		}

		return hasParentSelected(parentId);
	};

	itemIds.forEach((itemId) => {
		if (hasParentSelected(itemId)) {
			itemIdsToRemoveFromSelected.push(itemId);
		}
	});

	return itemIds.filter(
		(itemId) => !itemIdsToRemoveFromSelected.includes(itemId)
	);
}
