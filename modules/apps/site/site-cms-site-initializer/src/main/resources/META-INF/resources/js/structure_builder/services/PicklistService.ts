/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Picklist} from '../types/Picklist';
import getRandomId from '../utils/getRandomId';
import ApiHelper from './ApiHelper';

async function createPicklist({
	erc = getRandomId(),
	name,
}: {
	erc?: string;
	name: Liferay.Language.LocalizedValue<string>;
}) {
	return await ApiHelper.post(
		`/o/headless-admin-list-type/v1.0/list-type-definitions`,
		{
			externalReferenceCode: erc,
			name_i18n: name,
		}
	);
}

async function getPicklists(): Promise<Picklist[]> {
	const {items} = await ApiHelper.get(
		'/o/headless-admin-list-type/v1.0/list-type-definitions'
	);

	return items;
}

export default {
	createPicklist,
	getPicklists,
};
