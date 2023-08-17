/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export type Fragment = {
	cached: boolean;
	fragment: boolean;
	fragmentCollectionURL: string;
	fromMaster: boolean;
	hierarchy: string;
	itemId: string;
	itemType: string;
	name: string;
	renderTime: number;
};

export interface FragmentFilter {
	origin?: 'all' | 'fromMaster';
	status?: string;
	type?: string;
}

export const filterNames = {
	all: Liferay.Language.get('all'),
	cached: Liferay.Language.get('cached'),
	fragment: Liferay.Language.get('fragment'),
	fromMaster: Liferay.Language.get('from-master'),
	notCached: Liferay.Language.get('not-cached'),
	widget: Liferay.Language.get('widget'),
};
