/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openSelectionModal, sub} from 'frontend-js-web';

export default function propsTransformer({
	additionalProps: {selectDDMStructureURL},
	...props
}: {
	additionalProps: {selectDDMStructureURL: string};
}) {
	return {
		...props,
		onClick() {
			openSelectionModal({
				multiple: true,
				onSelect: (selectedItem) => {},
				title: sub(
					Liferay.Language.get('select-x'),
					Liferay.Language.get('structures')
				),
				url: selectDDMStructureURL,
			});
		},
	};
}
