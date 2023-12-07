/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import {Language} from '@liferay/layout-js-components-web';
declare type Field = Record<Liferay.Language.Locale, string>;
interface Props {
	defaultLanguageId: Liferay.Language.Locale;
	fields: Record<string, Field>;
	languages: Language[];
	portletNamespace: string;
	selectedLanguageId: Liferay.Language.Locale;
}
export default function TranslationManager({
	defaultLanguageId,
	fields,
	languages,
	portletNamespace,
	selectedLanguageId,
}: Props): JSX.Element;
export {};
