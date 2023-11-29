/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

import {Locale, Translations} from '@liferay/layout-js-components-web';
interface Props {
	defaultLocaleId: Liferay.Language.Locale;
	locales: Locale[];
	selectedLocaleId: Liferay.Language.Locale;
	translations: Translations;
}
export default function TranslationManager({
	defaultLocaleId,
	locales,
	selectedLocaleId,
	translations,
}: Props): JSX.Element;
export {};
