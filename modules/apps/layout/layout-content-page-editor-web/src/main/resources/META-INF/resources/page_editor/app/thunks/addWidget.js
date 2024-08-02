/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import addFragmentEntryLinks from '../actions/addFragmentEntryLinks';
import WidgetService from '../services/WidgetService';
import getFirstControlsId from '../utils/getFirstControlsId';

export default function addWidget({
	parentItemId,
	portletId,
	portletItemId,
	position,
	selectItem = () => {},
}) {
	return (dispatch, getState) => {
		return WidgetService.addPortlet({
			onNetworkStatus: dispatch,
			parentItemId,
			portletId,
			portletItemId,
			position,
			segmentsExperienceId: getState().segmentsExperienceId,
		}).then(({addedItemId, fragmentEntryLink, layoutData}) => {
			dispatch(
				addFragmentEntryLinks({
					addedItemId,
					fragmentEntryLinks: [fragmentEntryLink],
					layoutData,
				})
			);

			if (addedItemId) {
				const addedItem = layoutData.items[addedItemId];

				const controlsId = getFirstControlsId({
					item: addedItem,
					layoutData,
				});

				selectItem(controlsId);
			}
		});
	};
}
