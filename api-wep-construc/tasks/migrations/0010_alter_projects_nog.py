# Generated by Django 5.0 on 2023-12-22 05:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0009_projects_nog'),
    ]

    operations = [
        migrations.AlterField(
            model_name='projects',
            name='nog',
            field=models.CharField(default=10000, max_length=50),
        ),
    ]