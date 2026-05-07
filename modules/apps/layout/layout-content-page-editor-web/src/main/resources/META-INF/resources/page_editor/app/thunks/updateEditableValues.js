/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import updateEditableValuesAction from '../actions/updateEditableValues';
import FragmentService from '../services/FragmentService';
import {clearPageContents} from '../utils/usePageContents';

const pendingRequests = new Map();

export default function updateEditableValues({
	editableValues,
	fragmentEntryLinkId,
}) {
	return async (dispatch, getState) => {
		const {languageId, segmentsExperienceId} = getState();

		const previousRequest =
			pendingRequests.get(fragmentEntryLinkId) ?? Promise.resolve();

		const currentRequest = previousRequest
			.catch(() => {})
			.then(() =>
				FragmentService.updateEditableValues({
					editableValues,
					fragmentEntryLinkId,
					languageId,
					onNetworkStatus: dispatch,
					segmentsExperienceId,
				})
			);

		pendingRequests.set(fragmentEntryLinkId, currentRequest);

		const {fragmentEntryLink} = await currentRequest;

		if (pendingRequests.get(fragmentEntryLinkId) !== currentRequest) {
			return;
		}

		pendingRequests.delete(fragmentEntryLinkId);

		dispatch(
			updateEditableValuesAction({
				content: fragmentEntryLink.content,
				editableValues,
				fragmentEntryLinkId,
				segmentsExperienceId,
			})
		);

		clearPageContents();
	};
}
