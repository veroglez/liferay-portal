/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

export interface Language {
	icon: string;
	id: Liferay.Language.Locale;
	label: Liferay.Language.Locale;
	translations: number;
}
export interface Translation {
	fieldName: string;
	languages: Liferay.Language.Locale[];
}
interface Props {

	/**
	 * Current default language
	 */
	defaultLanguageId: Liferay.Language.Locale;

	/**
	 * List of languages to allow localization for
	 */
	languages: Language[];

	/**
	 * Callback that gets called when a selected language gets changed
	 */
	onSelectedLanguageChange: (item: any) => void;

	/**
	 * Currently selected language
	 */
	selectedLanguageId: Liferay.Language.Locale;

	/**
	 * Translations provided to the component to be used and modified by it
	 */
	translations: Translation[];
}
export default function TranslationSelector({
	defaultLanguageId,
	languages,
	onSelectedLanguageChange,
	selectedLanguageId,
	translations,
}: Props): JSX.Element;
export {};
