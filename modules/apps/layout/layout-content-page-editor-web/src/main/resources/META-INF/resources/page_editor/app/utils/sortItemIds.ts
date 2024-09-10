/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {LayoutDataItem} from '../../types/layout_data/LayoutData';

/**
 * Sort items ids based on layout data tree.
 *
 * First, the layout data item ids are sorted according to the layout data
 * tree with the addSortedChildIds function, and based on that, the itemIds
 * received as parameters in the sortItemIds function are sorted.
 */

const addSortedChildIds = (
	itemId: string,
	layoutDataItems: Record<string, LayoutDataItem>,
	orderedItemIds: string[]
) => {
	orderedItemIds.push(itemId);

	layoutDataItems[itemId]?.children.forEach((childId) =>
		addSortedChildIds(childId, layoutDataItems, orderedItemIds)
	);
};

export default function sortItemIds(
	itemIds: string[],
	layoutDataItems: Record<string, LayoutDataItem>
) {
	const sortedLayoutDataItemIds: string[] = [];

	for (const itemId in layoutDataItems) {
		addSortedChildIds(itemId, layoutDataItems, sortedLayoutDataItemIds);
	}

	return itemIds.sort(
		(a, b) =>
			sortedLayoutDataItemIds.indexOf(a) -
			sortedLayoutDataItemIds.indexOf(b)
	);
}
