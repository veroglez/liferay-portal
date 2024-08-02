/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import addFragmentEntryLinks from '../actions/addFragmentEntryLinks';
import {FRAGMENT_ENTRY_TYPES} from '../config/constants/fragmentEntryTypes';
import FragmentService from '../services/FragmentService';
import getFirstControlsId from '../utils/getFirstControlsId';

export default function addFragment({
	fragmentEntryKey,
	groupId,
	parentItemId,
	position,
	selectItem = () => {},
	type,
}) {
	return (dispatch, getState) => {
		const params = {
			fragmentEntryKey,
			groupId,
			onNetworkStatus: dispatch,
			parentItemId,
			position,
			segmentsExperienceId: getState().segmentsExperienceId,
			type,
		};

		const updateState = (fragmentEntryLinks, layoutData, itemId) => {
			dispatch(
				addFragmentEntryLinks({
					addedItemId: itemId,
					fragmentEntryLinks,
					layoutData,
				})
			);

			const addedItem = layoutData.items[itemId];

			const controlsId = getFirstControlsId({
				item: addedItem,
				layoutData,
			});

			selectItem(controlsId);
		};

		if (type === FRAGMENT_ENTRY_TYPES.composition) {
			return FragmentService.addFragmentEntryLinks(params).then(
				({addedItemId, fragmentEntryLinks, layoutData}) => {
					updateState(
						Object.values(fragmentEntryLinks),
						layoutData,
						addedItemId
					);
				}
			);
		}
		else {
			return FragmentService.addFragmentEntryLink(params).then(
				({addedItemId, fragmentEntryLink, layoutData}) => {
					updateState([fragmentEntryLink], layoutData, addedItemId);
				}
			);
		}
	};
}
