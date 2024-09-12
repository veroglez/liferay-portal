/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {LAYOUT_DATA_ITEM_TYPES} from '../config/constants/layoutDataItemTypes';
import {useSelectorCallback} from '../contexts/StoreContext';
import selectLayoutDataItemLabel from '../selectors/selectLayoutDataItemLabel';
import {deepEqual} from './checkDeepEqual';
import isItemWidget from './isItemWidget';

function normalizeDragItem(item, layoutData, fragmentEntryLinks) {
	const isWidget = isItemWidget(item, fragmentEntryLinks);
	const name = selectLayoutDataItemLabel(
		{
			fragmentEntryLinks,
			layoutData,
		},
		item
	);

	let fragmentEntryLink = null;

	if (item.type === LAYOUT_DATA_ITEM_TYPES.fragment) {
		fragmentEntryLink =
			fragmentEntryLinks[item.config?.fragmentEntryLinkId];
	}

	return {
		...item,
		fieldTypes: fragmentEntryLink?.fieldTypes ?? [],
		fragmentEntryType: fragmentEntryLink?.fragmentEntryType ?? null,
		isWidget,
		name,
	};
}

export default function useNormalizeDragItems(dragItem, dragActiveItems) {
	const normalizedDragItem = useSelectorCallback(
		(state) =>
			normalizeDragItem(
				dragItem,
				state.layoutData,
				state.fragmentEntryLinks
			),
		[dragItem],
		deepEqual
	);

	const normalizedDragActiveItems = useSelectorCallback(
		(state) => {
			const normalizedDragItems = [];

			for (const id of dragActiveItems) {
				const item = state.layoutData.items[id];

				if (item) {
					normalizedDragItems.push(
						normalizeDragItem(
							item,
							state.layoutData,
							state.fragmentEntryLinks
						)
					);
				}
			}

			return normalizedDragItems;
		},
		[dragActiveItems],
		deepEqual
	);

	return [normalizedDragItem, normalizedDragActiveItems];
}
