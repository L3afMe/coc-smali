.class public final synthetic Lme/l3af/treecord/widgets/TreecordSettings$binding$2;
.source "TreecordSettings.binding.2.smali"
.super Lc0/y/d/k;
.implements Lkotlin/jvm/functions/Function1;

.field public static final INSTANCE:Lme/l3af/treecord/widgets/TreecordSettings$binding$2;

.method public static constructor <clinit>()V
    .locals 1
    
    new-instance v0, Lme/l3af/treecord/widgets/TreecordSettings$binding$;
    invoke-direct {v0}, Lme/l3af/treecord/widgets/TreecordSettings$binding$2;-><init>()V
    sput-object v0, Lme/l3af/treecord/widgets/TreecordSettings$binding$2;->INSTANCE:Lme/l3af/treecord/widgets/TreecordSettings$binding$2;

    return-void
.end method

.method public constructor <init>()V
    .locals 6

    const-class v2, Lme/l3af/treecord/widgets/TreecordSettingsBinding;
    const/4 v1, 0x1
    const-string v3, "bind"
    const-string v4, "bind(Landroid/view/View;)Lme/l3af/treecord/widgets/TreecordSettingsBinding;"
    const/4 v5, 0x0
    move-object v0, p0
    invoke-direct/range {v0 .. v5}, Lc0/y/d/k;-><init>(ILjava/lang/Class;Ljava/lang/String;Ljava/lang/String;I)V

    return-void
.end method

.method public final invoke(Landroid/view/View;)Lme/l3af/treecord/widgets/TreecordSettingsBinding;
    .locals 10

    const-string/jumbo v0, "p1"
    invoke-static {p1, v0}, Lc0/y/d/m;->checkNotNullParameter(Ljava/lang/Object;Ljava/lang/String;)V

    const v0, {{id/treecord_settings_seeds}}
    invoke-virtual {p1, v0}, Landroid/view/View;->findViewById(I)Landroid/view/View;
    move-result-object v1
    move-object v4, v1
    check-cast v4, Landroid/widget/TextView;
    if-eqz v4, :cond_0

    const v0, {{id/treecord_settings_repo}}
    invoke-virtual {p1, v0}, Landroid/view/View;->findViewById(I)Landroid/view/View;
    move-result-object v1
    move-object v5, v1
    check-cast v5, Landroid/widget/TextView;
    if-eqz v5, :cond_0

    const v0, {{id/treecord_settings_discord}}
    invoke-virtual {p1, v0}, Landroid/view/View;->findViewById(I)Landroid/view/View;
    move-result-object v1
    move-object v6, v1
    check-cast v6, Landroid/widget/TextView;
    if-eqz v6, :cond_0

    const v0, {{id/treecord_settings_layout}}
    invoke-virtual {p1, v0}, Landroid/view/View;->findViewById(I)Landroid/view/View;
    move-result-object v1
    move-object v7, v1
    check-cast v7, Landroid/widget/LinearLayout;
    if-eqz v7, :cond_0

    new-instance v0, Lme/l3af/treecord/widgets/TreecordSettingsBinding;
    move-object v3, p1
    check-cast v3, Landroidx/coordinatorlayout/widget/CoordinatorLayout;
    move-object v2, v0

    invoke-direct/range {v2 .. v7}, Lme/l3af/treecord/widgets/TreecordSettingsBinding;-><init>(Landroidx/coordinatorlayout/widget/CoordinatorLayout;Landroid/widget/TextView;Landroid/widget/TextView;Landroid/widget/TextView;Landroid/widget/LinearLayout;)V

    return-object v0

    :cond_0
    invoke-virtual {p1}, Landroid/view/View;->getResources()Landroid/content/res/Resources;
    move-result-object p1

    invoke-virtual {p1, v0}, Landroid/content/res/Resources;->getResourceName(I)Ljava/lang/String;
    move-result-object p1

    new-instance v0, Ljava/lang/NullPointerException;
    const-string v1, "Missing required view with ID: "

    invoke-virtual {v1, p1}, Ljava/lang/String;->concat(Ljava/lang/String;)Ljava/lang/String;
    move-result-object p1

    invoke-direct {v0, p1}, Ljava/lang/NullPointerException;-><init>(Ljava/lang/String;)V

    throw v0
.end method

.method public bridge synthetic invoke(Ljava/lang/Object;)Ljava/lang/Object;
    .locals 0

    check-cast p1, Landroid/view/View;
    invoke-virtual {p0, p1}, Lme/l3af/treecord/widgets/TreecordSettings$binding$2;->invoke(Landroid/view/View;)Lme/l3af/treecord/widgets/TreecordSettingsBinding;
    move-result-object p1

    return-object p1
.end method
