/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

type Props = {
	fragmentDropZoneId: string;
	id: string;
	pageElements?: PageElement[];
};

export default function getFragmentDropZoneDefinition({
	fragmentDropZoneId,
	id,
	pageElements,
}: Props): PageElement {
	return {
		definition: {
			fragmentDropZoneId,
		},
		id,
		pageElements,
		type: 'FragmentDropZone',
	};
}
