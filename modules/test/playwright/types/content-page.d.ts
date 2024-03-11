/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

type Type =
	| 'Collection'
	| 'CollectionItem'
	| 'Column'
	| 'DropZone'
	| 'Form'
	| 'Fragment'
	| 'FragmentDropZone'
	| 'Root'
	| 'Row'
	| 'Section'
	| 'Widget';

type Layout = {
	friendlyUrlPath: string;
};

type PageDefinition = {
	pageElement: PageElement;
};

type PageElement = {
	definition?: {
		fragment?: {
			key: string;
		};
		widgetInstance?: {
			widgetName: string;
		};
	} & GridDefinition;
	id: string;
	pageElements?: PageElement[];
	type: Type;
};

type GridDefinition = {
	gutters?: boolean;
	numberOfColumns?: number;
	size?: number;
};
