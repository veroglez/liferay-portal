/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {formHasPermissions} from '../../../../src/main/resources/META-INF/resources/page_editor/app/utils/formHasPermissions';

jest.mock(
	'../../../../src/main/resources/META-INF/resources/page_editor/app/config',
	() => ({
		config: {
			formTypes: [
				{
					hasPermission: false,
					label: 'object-test-1',
					value: '1',
				},
				{
					hasPermission: true,
					label: 'object-test-2',
					value: '2',
				},
			],
		},
	})
);

describe('formHasPermissions', () => {
	it('checks if the item mapped to the form has permissions', () => {
		expect(
			formHasPermissions({
				config: {
					classNameId: '1',
					classTypeId: '0',
				},
				itemId: 'form-1',
				type: 'form',
			})
		).toBe(false);
		expect(
			formHasPermissions({
				config: {
					classNameId: '2',
					classTypeId: '0',
				},
				itemId: 'form-1',
				type: 'form',
			})
		).toBe(false);
	});
});
