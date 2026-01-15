<%--
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/layout/view/init.jsp" %>

<%
PanelCategoryHelper panelCategoryHelper = (PanelCategoryHelper)request.getAttribute(ApplicationListWebKeys.PANEL_CATEGORY_HELPER);
%>

<c:choose>
	<c:when test='<%= panelCategoryHelper.containsPortlet(themeDisplay.getPpid(), "applications_menu") %>'>
		<%--
		/**
		 * This would be a React component that receives the navigation menu data
		 * as properties. The data will be retrieved based on the current
		 * portlet (ppid) being rendered.
		 */
		--%>
		<div id="--menu-left" class="d-flex">
			<ul>
				<li>
					item 1
				</li>
				<li>
					item 2
				</li>
			</ul>

			<div class="w-100">
				<liferay-application-list:application-content
					portletId="<%= themeDisplay.getPpid() %>"
				/>
			</div>

			<liferay-layout:layout-common />
		</div>
	</c:when>
	<c:otherwise>
			<liferay-application-list:application-content
				portletId="<%= themeDisplay.getPpid() %>"
			/>

			<liferay-layout:layout-common />
	</c:otherwise>
</c:choose>
