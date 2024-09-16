/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {renderHook} from '@testing-library/react-hooks';
import React from 'react';

import useNormalizeDragItems from '../../../../src/main/resources/META-INF/resources/page_editor/app/utils/useNormalizeDragItems';
import StoreMother from '../../../../src/main/resources/META-INF/resources/page_editor/test_utils/StoreMother';

const DEFAULT_ITEM = {
	config: {},
	itemId: 'item01',
	type: 'container',
};

const wrapper = ({children}) => (
	<StoreMother.Component
		getState={() => ({
			layoutData: {
				items: {
					item01: DEFAULT_ITEM,
					item02: {
						config: {},
						itemId: 'item02',
						type: 'container',
					},
				},
			},
		})}
	>
		{children}
	</StoreMother.Component>
);

describe('useNormalizeDragItems', () => {
	const normalizedDragItem = (itemId) => ({
		config: {},
		fieldTypes: [],
		fragmentEntryType: null,
		isWidget: false,
		itemId,
		name: 'container',
		type: 'container',
	});

	it('normalizes drag items', () => {
		const {result} = renderHook(
			() => useNormalizeDragItems(DEFAULT_ITEM, ['item01', 'item02']),
			{wrapper}
		);

		const normalizedDefaultItem = normalizedDragItem('item01');

		expect(result.current).toStrictEqual([
			normalizedDefaultItem,
			[normalizedDefaultItem, normalizedDragItem('item02')],
		]);
	});
});
