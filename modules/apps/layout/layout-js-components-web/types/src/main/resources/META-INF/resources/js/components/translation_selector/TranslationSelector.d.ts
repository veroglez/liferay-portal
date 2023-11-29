/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/// <reference types="react" />

export interface Locale {
	icon: string;
	id: Liferay.Language.Locale;
	label: Liferay.Language.Locale;
	translations: number;
}
export interface Translations {
	[key: string]: Record<Liferay.Language.Locale, string>;
}
interface Props {

	/**
	 * Current default locale
	 */
	defaultLocaleId: string;

	/**
	 * List of locales to allow localization for
	 */
	locales: Locale[];

	/**
	 * Callback that gets called when a selected locale gets changed
	 */
	onSelectedLocaleChange: (item: any) => void;

	/**
	 * Currently selected locale
	 */
	selectedLocaleId: Liferay.Language.Locale;

	/**
	 * Translations provided to the component to be used and modified by it
	 */
	translations: Translations;
}
export default function TranslationSelector({
	defaultLocaleId,
	locales,
	onSelectedLocaleChange,
	selectedLocaleId,
	translations,
}: Props): JSX.Element;
export {};
