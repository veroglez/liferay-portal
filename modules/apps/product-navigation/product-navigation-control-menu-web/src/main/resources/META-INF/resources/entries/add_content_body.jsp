<%--
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
--%>

<%@ include file="/init.jsp" %>

<%
AddContentPanelDisplayContext addContentPanelDisplayContext = new AddContentPanelDisplayContext(request);
%>

<liferay-util:body-bottom
	outputKey="addContentMenu"
>
	<div class="closed d-print-none lfr-add-panel lfr-admin-panel sidenav-fixed sidenav-menu-slider sidenav-right" id="<%= addContentPanelDisplayContext.getNamespace() %>addPanelId">
		<div class="product-menu sidebar sidebar-inverse sidenav-menu">
			<div class="sidebar-header">
				<h1 class="sr-only"><liferay-ui:message key="widget-selection-panel" /></h1>

				<span><liferay-ui:message key="add" /></span>

				<a aria-label="<%= LanguageUtil.get(request, "close") %>" class="sidenav-close" href="javascript:;">
					<aui:icon cssClass="icon-monospaced" image="times" markupView="lexicon" />
				</a>
			</div>

			<div class="sidebar-body"></div>
		</div>
	</div>

	<div>
		<react:component
			data="<%= addContentPanelDisplayContext.getAddContentPanelData() %>"
			module="js/AddPanel"
		/>
	</div>

	<aui:script>
		var addToggle = document.getElementById(
			'<%= addContentPanelDisplayContext.getNamespace() %>addToggleId'
		);

		Liferay.SideNavigation.initialize(addToggle);

		Liferay.once('screenLoad', function () {
			Liferay.SideNavigation.destroy(addToggle);
		});
	</aui:script>
</liferay-util:body-bottom>